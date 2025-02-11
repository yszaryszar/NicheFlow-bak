package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "github.com/yszaryszar/NicheFlow/backend/docs" // 导入 swagger 文档
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/handler"
	"github.com/yszaryszar/NicheFlow/backend/internal/middleware"
	"github.com/yszaryszar/NicheFlow/backend/pkg/cache"
	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

// @title NicheFlow API
// @version 1.0
// @description NicheFlow 后端 API 文档
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.nicheflow.com/support
// @contact.email support@nicheflow.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api
// @schemes http https

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description 请在此输入 Bearer {token}

func main() {
	// 加载配置
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 初始化数据库连接
	if _, err := database.NewPostgresDB(&cfg.Database); err != nil {
		log.Fatalf("初始化数据库失败: %v", err)
	}
	defer database.Close()

	// 初始化 Redis 连接
	if _, err := cache.NewRedisClient(&cfg.Redis); err != nil {
		log.Fatalf("初始化 Redis 失败: %v", err)
	}
	defer cache.Close()

	// 设置运行模式
	gin.SetMode(cfg.App.Mode)

	// 创建路由
	r := gin.Default()

	// 注册 Swagger 路由
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// 创建处理器
	authHandler := handler.NewAuthHandler(cfg)

	// API 路由组
	api := r.Group("/api")
	{
		// 认证相关路由
		auth := api.Group("/auth")
		{
			// 公开路由
			auth.GET("/providers", authHandler.HandleProviders)
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

		// TODO: 后续添加其他 API 路由
	}

	// 启动服务器
	addr := fmt.Sprintf(":%d", cfg.App.Port)
	log.Printf("服务器启动在 %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
