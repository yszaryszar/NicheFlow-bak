package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/pkg/cache"
	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

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

	// 启动服务器
	addr := fmt.Sprintf(":%d", cfg.App.Port)
	log.Printf("服务器启动在 %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
