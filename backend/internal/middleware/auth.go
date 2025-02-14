// Package middleware 提供了 HTTP 中间件功能
package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
	"go.uber.org/zap"
)

var (
	rdb    *redis.Client
	logger *zap.Logger
)

// init 初始化中间件包
func init() {
	// 初始化 Clerk SDK
	clerkAPIKey := os.Getenv("CLERK_API_KEY")
	if clerkAPIKey == "" {
		panic("未设置 CLERK_API_KEY 环境变量")
	}
	clerk.SetKey(clerkAPIKey)

	// 初始化 Redis 客户端
	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	redisDB := os.Getenv("REDIS_DB")

	db, _ := strconv.Atoi(redisDB)
	rdb = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", redisHost, redisPort),
		Password: redisPassword,
		DB:       db,
	})

	// 初始化日志
	var err error
	logger, err = zap.NewProduction()
	if err != nil {
		panic(fmt.Sprintf("初始化日志失败: %v", err))
	}
}

// RateLimit 创建速率限制中间件
//
// 参数:
//   - limit: 在指定时间段内允许的最大请求数
//   - duration: 速率限制的时间窗口
//
// 返回:
//   - gin.HandlerFunc: Gin 中间件函数
//
// 说明:
//
//	该中间件使用 Redis 实现请求速率限制，通过客户端 IP 地址跟踪请求次数。
//	当请求超过限制时，返回 429 Too Many Requests 状态码。
func RateLimit(limit int, duration time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := fmt.Sprintf("rate_limit:%s", c.ClientIP())
		ctx := context.Background()

		// 获取当前计数
		count, err := rdb.Get(ctx, key).Int()
		if err != nil && err != redis.Nil {
			logger.Error("获取速率限制计数失败", zap.Error(err))
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
		pipe := rdb.Pipeline()
		pipe.Incr(ctx, key)
		if count == 0 {
			pipe.Expire(ctx, key, duration)
		}
		_, err = pipe.Exec(ctx)
		if err != nil {
			logger.Error("更新速率限制计数失败", zap.Error(err))
		}

		c.Next()
	}
}

// AuthMiddleware Clerk 认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path
		logger.Info("处理请求",
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
				logger.Error("获取用户信息失败",
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

// RequireRoles 创建角色验证中间件
//
// 参数:
//   - roles: 允许访问的角色列表
//
// 返回:
//   - gin.HandlerFunc: Gin 中间件函数
//
// 说明:
//
//	该中间件检查用户是否具有所需的角色权限。
//	如果用户没有所需角色，返回 403 Forbidden 状态码。
//	必须在 AuthMiddleware 之后使用此中间件。
func RequireRoles(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			logger.Warn("未找到用户信息",
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
			logger.Warn("用户权限不足",
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
