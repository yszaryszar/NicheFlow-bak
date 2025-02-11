package model

import (
	"log"

	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

// AutoMigrate 自动迁移数据库结构
func AutoMigrate() error {
	db := database.GetDB()
	if db == nil {
		log.Fatal("数据库连接未初始化")
	}

	// 自动迁移表结构
	err := db.AutoMigrate(
		&User{},
		&Session{},
		&Account{},
		&VerificationToken{},
	)
	if err != nil {
		log.Printf("数据库迁移失败: %v", err)
		return err
	}

	log.Println("数据库迁移成功")
	return nil
}
