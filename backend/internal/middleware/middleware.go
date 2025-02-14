// Package middleware 提供了 HTTP 中间件功能
// 包含中间件管理器和各种中间件的实现
package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"go.uber.org/zap"
)

// Manager 中间件管理器
// 负责管理和配置所有中间件，提供统一的中间件访问接口
type Manager struct {
	cfg    *config.Config // 应用配置
	logger *zap.Logger    // 日志记录器
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
	logger, _ := zap.NewProduction()
	return &Manager{
		cfg:    cfg,
		logger: logger,
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
		r.Use(RateLimit(
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
		c.Writer.Header().Set("Access-Control-Allow-Origin", corsConfig.AllowOrigins[0]) // 暂时只使用第一个源
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
	return AuthMiddleware()
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
	return RequireRoles(roles...)
}

// Close 关闭中间件管理器
//
// 说明:
//
//	该方法执行中间件管理器的清理工作，包括：
//	1. 同步日志记录器
//	2. 关闭其他可能的资源连接
func (m *Manager) Close() {
	if err := m.logger.Sync(); err != nil {
		m.logger.Error("关闭日志器失败", zap.Error(err))
	}
}
