package router

import (
	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/handler"
	"github.com/yszaryszar/NicheFlow/backend/internal/middleware"
)

// SetupRouter 设置路由
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// 中间件
	r.Use(middleware.CORS())

	// 用户处理器
	userHandler := handler.NewUserHandler()

	// API 路由组
	api := r.Group("/api")
	{
		// 用户相关路由
		user := api.Group("/user")
		{
			user.GET("/profile", userHandler.GetProfile)
			user.PUT("/profile", userHandler.UpdateProfile)
			user.GET("/usage", userHandler.GetUsage)
			user.GET("/subscription", userHandler.GetSubscription)
		}

		// Clerk Webhook
		r.POST("/webhook/clerk", userHandler.WebhookHandler)
	}

	return r
}
