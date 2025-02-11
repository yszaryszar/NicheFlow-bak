package database

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	db   *gorm.DB
	once sync.Once
)

// InitDB 初始化数据库连接
func InitDB(dsn string) error {
	var err error
	once.Do(func() {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Printf("数据库连接失败: %v", err)
			return
		}
		fmt.Println("数据库连接成功")
	})
	return err
}

// NewPostgresDB 创建 PostgreSQL 数据库连接
func NewPostgresDB(cfg *config.DatabaseConfig) (*gorm.DB, error) {
	if db != nil {
		return db, nil
	}

	// 构建连接字符串
	dsn := fmt.Sprintf("host=%s port=%d user=%s dbname=%s password=%s",
		cfg.Host,
		cfg.Port,
		cfg.User,
		cfg.Name,
		cfg.Password,
	)

	// 添加 SSL 配置
	if cfg.SSLMode != "" {
		dsn += fmt.Sprintf(" sslmode=%s", cfg.SSLMode)
	}

	// 解析连接最大生命周期
	connMaxLifetime, err := time.ParseDuration(cfg.ConnMaxLifetime)
	if err != nil {
		return nil, fmt.Errorf("解析连接最大生命周期失败: %w", err)
	}

	// 配置 GORM
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	// 连接数据库
	db, err = gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return nil, fmt.Errorf("连接数据库失败: %w", err)
	}

	// 获取底层 SQL DB 以配置连接池
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("获取 SQL DB 失败: %w", err)
	}

	// 配置连接池
	sqlDB.SetMaxIdleConns(cfg.MaxIdleConns)
	sqlDB.SetMaxOpenConns(cfg.MaxOpenConns)
	sqlDB.SetConnMaxLifetime(connMaxLifetime)

	return db, nil
}

// GetDB 获取数据库连接实例
func GetDB() *gorm.DB {
	return db
}

// SetDB 设置数据库连接实例（仅用于测试）
func SetDB(instance *gorm.DB) {
	db = instance
}

// Close 关闭数据库连接
func Close() error {
	if db != nil {
		sqlDB, err := db.DB()
		if err != nil {
			return fmt.Errorf("获取 SQL DB 失败: %w", err)
		}
		return sqlDB.Close()
	}
	return nil
}
