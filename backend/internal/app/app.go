// Package app 提供应用程序的生命周期管理
// 负责应用的初始化、运行和关闭等核心功能
// 管理配置加载、数据库连接、缓存服务和路由设置
package app

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/router"
	"github.com/yszaryszar/NicheFlow/backend/pkg/cache"
	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

// Application 应用结构体
// 包含应用运行所需的核心组件
// 管理应用的配置和 HTTP 引擎
type Application struct {
	config *config.Config // 应用配置实例
	engine *gin.Engine    // Gin HTTP 引擎实例
}

// New 创建新的应用实例
//
// 返回:
//   - *Application: 应用实例
//   - error: 创建过程中的错误，如果成功则为 nil
//
// 说明:
//
//	该函数完成以下操作：
//	1. 加载应用配置
//	2. 设置 Gin 运行模式
//	3. 创建应用实例
func New() (*Application, error) {
	// 加载配置
	cfg, err := config.LoadConfig()
	if err != nil {
		return nil, fmt.Errorf("加载配置失败: %v", err)
	}

	// 设置运行模式
	gin.SetMode(cfg.App.Mode)

	return &Application{
		config: cfg,
	}, nil
}

// Initialize 初始化应用
//
// 返回:
//   - error: 初始化过程中的错误，如果成功则为 nil
//
// 说明:
//
//	该函数完成以下初始化：
//	1. 建立数据库连接
//	2. 执行数据库迁移
//	3. 建立 Redis 连接
//	4. 设置 HTTP 路由
//
// 注意:
//
//	必须在调用 Run 方法之前调用此方法
//	初始化失败会返回详细的错误信息
func (app *Application) Initialize() error {
	// 初始化数据库连接
	if _, err := database.NewPostgresDB(&app.config.Database); err != nil {
		return fmt.Errorf("初始化数据库失败: %v", err)
	}

	// 运行数据库迁移
	if err := model.AutoMigrate(); err != nil {
		return fmt.Errorf("数据库迁移失败: %v", err)
	}

	// 初始化 Redis 连接
	if _, err := cache.NewRedisClient(&app.config.Redis); err != nil {
		return fmt.Errorf("初始化 Redis 失败: %v", err)
	}

	// 设置路由
	app.engine = router.SetupRouter(app.config)

	return nil
}

// Run 运行应用
//
// 返回:
//   - error: 运行过程中的错误，如果成功则为 nil
//
// 说明:
//
//	该函数启动 HTTP 服务器：
//	1. 使用配置的端口
//	2. 输出启动日志
//	3. 开始接受 HTTP 请求
//
// 注意:
//
//	这是一个阻塞调用
//	服务器会一直运行直到收到中断信号
func (app *Application) Run() error {
	addr := fmt.Sprintf(":%d", app.config.App.Port)
	log.Printf("服务器启动在 %s", addr)
	return app.engine.Run(addr)
}

// Shutdown 关闭应用
//
// 说明:
//
//	该函数执行清理操作：
//	1. 关闭数据库连接
//	2. 关闭 Redis 连接
//	3. 释放其他资源
//
// 注意:
//
//	应在应用退出前调用此方法
//	建议使用 defer 确保资源被正确释放
func (app *Application) Shutdown() {
	database.Close()
	cache.Close()
}
