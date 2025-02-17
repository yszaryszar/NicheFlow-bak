// Package router 提供了 HTTP 路由配置功能
// 负责设置和管理所有 API 路由，包括中间件配置和路由分组
package router

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/handler"
	"github.com/yszaryszar/NicheFlow/backend/internal/middleware"
)

// SetupRouter 设置并配置 HTTP 路由
//
// 参数:
//   - cfg: 应用配置对象，包含路由和中间件相关的配置信息
//
// 返回:
//   - *gin.Engine: 配置好的 Gin 引擎实例
//
// 说明:
//
//	该函数完成以下配置：
//	1. 创建新的 Gin 引擎实例
//	2. 设置全局中间件
//	3. 注册 Swagger 文档路由
//	4. 配置 API 路由组
//	5. 设置用户相关路由
//	6. 配置 Webhook 路由
//	7. 设置管理员路由
func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.New()

	// 创建中间件管理器
	middlewareManager := middleware.NewManager(cfg)
	defer middlewareManager.Close()

	// 设置全局中间件
	middlewareManager.SetupMiddlewares(r)

	// 健康检查路由
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"version": cfg.App.Version,
		})
	})

	// 注册 Swagger 路由
	// @title NicheFlow API
	// @version 1.0
	// @description NicheFlow 后端 API 服务
	// @termsOfService http://swagger.io/terms/
	//
	// @contact.name API Support
	// @contact.url http://www.nicheflow.com/support
	// @contact.email support@nicheflow.com
	//
	// @license.name Apache 2.0
	// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
	//
	// @host localhost:8080
	// @BasePath /api
	//
	// @securityDefinitions.apikey ClerkAuth
	// @in header
	// @name Authorization
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// 创建处理器
	userHandler := handler.NewUserHandler()
	authHandler := handler.NewAuthHandler()

	// API 路由组
	v1 := r.Group("/v1")
	{
		// 认证相关路由
		auth := v1.Group("/auth")
		{
			auth.POST("/sync", authHandler.SyncUserData)
		}

		// 用户相关路由
		user := v1.Group("/user")
		user.Use(middlewareManager.GetAuthMiddleware())
		{
			// @Summary 获取用户个人资料
			// @Tags 用户
			user.GET("/profile", userHandler.GetProfile)

			// @Summary 更新用户个人资料
			// @Tags 用户
			user.PUT("/profile", userHandler.UpdateProfile)

			// @Summary 获取用户偏好设置
			// @Tags 用户
			user.GET("/preferences", userHandler.GetPreferences)

			// @Summary 更新用户偏好设置
			// @Tags 用户
			user.PUT("/preferences", userHandler.UpdatePreferences)

			// @Summary 获取用户社交账号
			// @Tags 用户
			user.GET("/social-accounts", userHandler.GetSocialAccounts)

			// @Summary 添加用户社交账号
			// @Tags 用户
			user.POST("/social-accounts", userHandler.LinkSocialAccount)

			// @Summary 删除用户社交账号
			// @Tags 用户
			user.DELETE("/social-accounts/:provider/:accountId", userHandler.UnlinkSocialAccount)

			// @Summary 获取用户使用统计
			// @Tags 用户
			user.GET("/usage", userHandler.GetUsage)

			// @Summary 获取用户订阅信息
			// @Tags 用户
			user.GET("/subscription", userHandler.GetSubscription)
		}

		// Webhook 路由
		// 不需要认证，用于处理外部服务回调
		webhook := v1.Group("/webhook")
		{
			// @Summary 处理 Clerk Webhook
			// @Tags Webhook
			webhook.POST("/clerk", userHandler.WebhookHandler)
		}

		// 管理员路由
		// 需要认证和管理员角色
		admin := v1.Group("/admin")
		admin.Use(
			middlewareManager.GetAuthMiddleware(),
			middlewareManager.GetRequireRoles("admin"),
		)
		{
			// TODO: 添加管理员路由
		}
	}

	return r
}
