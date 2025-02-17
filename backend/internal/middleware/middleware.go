// Package middleware 提供了 HTTP 中间件功能
// 包含中间件管理器和各种中间件的实现
package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
	"go.uber.org/zap"
)

// Manager 中间件管理器
// 负责管理和配置所有中间件，提供统一的中间件访问接口
type Manager struct {
	cfg    *config.Config // 应用配置
	logger *zap.Logger    // 日志记录器
	rdb    *redis.Client  // Redis 客户端
}

// NewManager 创建一个新的中间件管理器实例
//
// 参数:
//   - cfg: 应用配置对象，包含中间件相关的配置信息
//
// 返回:
//   - *Manager: 中间件管理器实例
//
// 说明:
//
//	该函数初始化中间件管理器，设置日志记录器和配置信息。
//	管理器用于统一管理和配置所有中间件。
func NewManager(cfg *config.Config) *Manager {
	// 初始化日志
	logger, err := zap.NewProduction()
	if err != nil {
		panic(fmt.Sprintf("初始化日志失败: %v", err))
	}

	// 初始化 Redis 客户端
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Redis.Host, cfg.Redis.Port),
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
	})

	// 初始化 Clerk SDK
	if cfg.Clerk.APIKey == "" {
		panic("未设置 Clerk API Key")
	}
	clerk.SetKey(cfg.Clerk.APIKey)

	return &Manager{
		cfg:    cfg,
		logger: logger,
		rdb:    rdb,
	}
}

// SetupMiddlewares 设置全局中间件
//
// 参数:
//   - r: Gin 引擎实例
//
// 说明:
//
//	该方法为 Gin 引擎设置全局中间件，包括：
//	1. 基础中间件（Recovery 和 Logger）
//	2. CORS 中间件
//	3. 速率限制中间件（如果启用）
func (m *Manager) SetupMiddlewares(r *gin.Engine) {
	// 基础中间件
	r.Use(gin.Recovery())
	if m.cfg.App.Mode == gin.DebugMode {
		r.Use(gin.Logger())
	}

	// CORS 中间件
	r.Use(m.CORS())

	// 速率限制中间件（如果启用）
	if m.cfg.Middleware.RateLimit.Enabled {
		r.Use(m.RateLimit(
			m.cfg.Middleware.RateLimit.Limit,
			m.cfg.Middleware.RateLimit.Duration,
		))
	}
}

// CORS 返回 CORS 中间件
//
// 返回:
//   - gin.HandlerFunc: CORS 中间件函数
//
// 说明:
//
//	该方法返回一个配置好的 CORS 中间件，用于处理跨域请求。
//	中间件根据配置文件中的 CORS 设置来配置允许的源、方法、头部等。
func (m *Manager) CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		corsConfig := m.cfg.Middleware.CORS

		// 设置 CORS 头
		c.Writer.Header().Set("Access-Control-Allow-Origin", corsConfig.AllowOrigins[0])
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", corsConfig.AllowHeaders[0])
		c.Writer.Header().Set("Access-Control-Allow-Methods", corsConfig.AllowMethods[0])
		c.Writer.Header().Set("Access-Control-Max-Age", fmt.Sprintf("%d", corsConfig.MaxAge))

		if len(corsConfig.ExposeHeaders) > 0 {
			c.Writer.Header().Set("Access-Control-Expose-Headers", corsConfig.ExposeHeaders[0])
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// RateLimit 创建速率限制中间件
func (m *Manager) RateLimit(limit int, duration time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := fmt.Sprintf("rate_limit:%s", c.ClientIP())
		ctx := context.Background()

		// 获取当前计数
		count, err := m.rdb.Get(ctx, key).Int()
		if err != nil && err != redis.Nil {
			m.logger.Error("获取速率限制计数失败", zap.Error(err))
			c.Next()
			return
		}

		if count >= limit {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "请求过于频繁，请稍后再试",
			})
			return
		}

		// 增加计数
		pipe := m.rdb.Pipeline()
		pipe.Incr(ctx, key)
		if count == 0 {
			pipe.Expire(ctx, key, duration)
		}
		_, err = pipe.Exec(ctx)
		if err != nil {
			m.logger.Error("更新速率限制计数失败", zap.Error(err))
		}

		c.Next()
	}
}

// GetAuthMiddleware 获取认证中间件
//
// 返回:
//   - gin.HandlerFunc: 认证中间件函数
//
// 说明:
//
//	该方法返回一个配置好的认证中间件，用于验证用户身份。
//	中间件会验证请求中的认证令牌，并将用户信息添加到请求上下文中。
func (m *Manager) GetAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		m.logger.Info("处理请求",
			zap.String("path", path),
			zap.String("method", c.Request.Method))

		// 使用 Clerk HTTP 中间件验证请求
		handler := clerkhttp.RequireHeaderAuthorization()(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 从上下文获取会话声明
			sessionClaims, ok := clerk.SessionClaimsFromContext(r.Context())
			if !ok {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
					"error": "未授权访问",
				})
				return
			}

			// 获取用户服务
			userService := service.NewUserService()

			// 获取用户信息
			user, err := userService.GetUserByClerkID(r.Context(), sessionClaims.Subject)
			if err != nil {
				m.logger.Error("获取用户信息失败",
					zap.String("path", path),
					zap.String("clerkID", sessionClaims.Subject),
					zap.Error(err))
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"error": "获取用户信息失败",
				})
				return
			}

			// 将用户信息存储到上下文
			c.Set("user", user)
			c.Next()
		}))

		handler.ServeHTTP(c.Writer, c.Request)
	}
}

// GetRequireRoles 获取角色验证中间件
//
// 参数:
//   - roles: 允许访问的角色列表
//
// 返回:
//   - gin.HandlerFunc: 角色验证中间件函数
//
// 说明:
//
//	该方法返回一个配置好的角色验证中间件，用于检查用户权限。
//	中间件会验证用户是否具有所需的角色权限。
func (m *Manager) GetRequireRoles(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			m.logger.Warn("未找到用户信息",
				zap.String("path", c.Request.URL.Path),
			)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "未认证的用户",
			})
			return
		}

		userModel := user.(*model.User)
		hasRole := false
		for _, role := range roles {
			if userModel.Role == role {
				hasRole = true
				break
			}
		}

		if !hasRole {
			m.logger.Warn("用户权限不足",
				zap.String("path", c.Request.URL.Path),
				zap.String("user_id", strconv.FormatUint(uint64(userModel.ID), 10)),
				zap.String("required_roles", fmt.Sprintf("%v", roles)),
				zap.String("user_role", userModel.Role),
			)
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "权限不足",
			})
			return
		}

		c.Next()
	}
}

// Close 关闭中间件管理器
//
// 说明:
//
//	该方法执行中间件管理器的清理工作，包括：
//	1. 同步日志记录器
//	2. 关闭其他可能的资源连接
func (m *Manager) Close() {
	if m.logger != nil {
		m.logger.Sync()
	}
	if m.rdb != nil {
		m.rdb.Close()
	}
}
