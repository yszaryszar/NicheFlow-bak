// Package database 提供数据库连接和管理功能
// 包含 PostgreSQL 数据库的连接池管理、配置和操作接口
package database

import (
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	db   *gorm.DB  // 全局数据库连接实例
	once sync.Once // 确保只初始化一次的同步锁
)

// InitDB 初始化数据库连接
//
// 参数:
//   - dsn: 数据库连接字符串
//
// 返回:
//   - error: 初始化过程中的错误，如果成功则为 nil
//
// 说明:
//
//	使用 sync.Once 确保数据库只被初始化一次
//	适用于简单的数据库初始化场景
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
//
// 参数:
//   - cfg: 数据库配置对象，包含连接参数和连接池设置
//
// 返回:
//   - *gorm.DB: GORM 数据库连接实例
//   - error: 创建过程中的错误，如果成功则为 nil
//
// 说明:
//
//	该函数完成以下配置：
//	1. 构建数据库连接字符串
//	2. 配置 SSL 连接
//	3. 设置 GORM 日志和性能选项
//	4. 配置连接池参数
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
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             time.Second,   // 慢查询阈值
				LogLevel:                  logger.Silent, // 日志级别
				IgnoreRecordNotFoundError: true,          // 忽略记录未找到错误
				Colorful:                  false,         // 禁用彩色输出
			},
		),
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
	sqlDB.SetMaxIdleConns(cfg.MaxIdleConns)   // 最大空闲连接数
	sqlDB.SetMaxOpenConns(cfg.MaxOpenConns)   // 最大打开连接数
	sqlDB.SetConnMaxLifetime(connMaxLifetime) // 连接最大生命周期

	return db, nil
}

// GetDB 获取数据库连接实例
//
// 返回:
//   - *gorm.DB: 全局数据库连接实例
//
// 说明:
//
//	返回已初始化的数据库连接实例
//	如果数据库未初始化，返回 nil
func GetDB() *gorm.DB {
	return db
}

// SetDB 设置数据库连接实例
//
// 参数:
//   - instance: 要设置的数据库实例
//
// 说明:
//
//	主要用于测试场景，允许注入模拟的数据库连接
//	在生产环境中应谨慎使用
func SetDB(instance *gorm.DB) {
	db = instance
}

// Close 关闭数据库连接
//
// 返回:
//   - error: 关闭过程中的错误，如果成功则为 nil
//
// 说明:
//
//	安全地关闭数据库连接
//	在应用程序退出时调用
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
