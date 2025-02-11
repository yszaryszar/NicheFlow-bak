package testutil

import (
	"log"
	"os"
	"time"

	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// SetupTestDB 设置测试数据库
func SetupTestDB() *gorm.DB {
	// 使用内存数据库
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold:             time.Second,
				LogLevel:                  logger.Silent,
				IgnoreRecordNotFoundError: true,
				Colorful:                  false,
			},
		),
		// 禁用外键约束以避免测试中的问题
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Fatalf("设置测试数据库失败: %v", err)
	}

	// 迁移数据库结构
	err = db.AutoMigrate(
		&model.User{},
		&model.Session{},
		&model.Account{},
		&model.VerificationToken{},
	)
	if err != nil {
		log.Fatalf("迁移数据库失败: %v", err)
	}

	return db
}

// CleanupTestDB 清理测试数据库
func CleanupTestDB(db *gorm.DB) {
	sqlDB, err := db.DB()
	if err != nil {
		log.Printf("获取 SQL DB 失败: %v", err)
		return
	}
	sqlDB.Close()
}
