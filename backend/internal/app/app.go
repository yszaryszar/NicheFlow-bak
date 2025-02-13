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
type Application struct {
	config *config.Config
	engine *gin.Engine
}

// New 创建新的应用实例
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
func (app *Application) Run() error {
	addr := fmt.Sprintf(":%d", app.config.App.Port)
	log.Printf("服务器启动在 %s", addr)
	return app.engine.Run(addr)
}

// Shutdown 关闭应用
func (app *Application) Shutdown() {
	database.Close()
	cache.Close()
}
