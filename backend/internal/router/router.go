package router

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/handler"
	"github.com/yszaryszar/NicheFlow/backend/internal/middleware"
)

// SetupRouter 设置路由
func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())

	// 只在开发模式下启用日志中间件
	if cfg.App.Mode == gin.DebugMode {
		r.Use(gin.Logger())
	}

	// 全局中间件
	r.Use(middleware.CORS())

	// 注册 Swagger 路由
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// 创建处理器
	authHandler := handler.NewAuthHandler(cfg)
	userHandler := handler.NewUserHandler()

	// API 路由组
	api := r.Group("/api")
	{
		// 认证相关路由
		auth := api.Group("/auth")
		{
			// 公开路由
			auth.GET("/providers", authHandler.HandleProviders)
			auth.GET("/url/:provider", authHandler.HandleAuthURL)
			auth.GET("/callback/:provider", authHandler.HandleCallback)
			auth.GET("/verify-email", authHandler.HandleVerifyEmail)

			// 需要认证的路由
			authed := auth.Group("")
			authed.Use(middleware.AuthMiddleware())
			{
				authed.GET("/session", authHandler.HandleSession)
				authed.POST("/signout", authHandler.HandleSignOut)
			}
		}

		// 用户相关路由
		user := api.Group("/user")
		user.Use(middleware.AuthMiddleware())
		{
			user.GET("/profile", userHandler.GetProfile)
			user.PUT("/profile", userHandler.UpdateProfile)
			user.GET("/usage", userHandler.GetUsage)
			user.GET("/subscription", userHandler.GetSubscription)
		}

		// Webhook 路由
		webhook := api.Group("/webhook")
		{
			webhook.POST("/clerk", userHandler.WebhookHandler)
		}
	}

	return r
}
