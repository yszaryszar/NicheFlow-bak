// Package model 提供了应用的数据模型定义
package model

import (
	"log"

	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

// AutoMigrate 自动迁移数据库表结构
func AutoMigrate() error {
	db := database.GetDB()
	if db == nil {
		log.Fatal("数据库连接未初始化")
	}

	// 1. 首先创建一个临时的 email_verified_new 列
	if err := db.Exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_new boolean DEFAULT false`).Error; err != nil {
		log.Printf("添加临时列失败: %v", err)
		return err
	}

	// 2. 更新临时列的值
	if err := db.Exec(`UPDATE users SET email_verified_new = true WHERE email_verified IS NOT NULL`).Error; err != nil {
		log.Printf("更新临时列失败: %v", err)
		return err
	}

	// 3. 删除原有的 email_verified 列
	if err := db.Exec(`ALTER TABLE users DROP COLUMN IF EXISTS email_verified`).Error; err != nil {
		log.Printf("删除原有列失败: %v", err)
		return err
	}

	// 4. 重命名临时列
	if err := db.Exec(`ALTER TABLE users RENAME COLUMN email_verified_new TO email_verified`).Error; err != nil {
		log.Printf("重命名临时列失败: %v", err)
		return err
	}

	// 5. 执行其他模型的迁移
	err := db.AutoMigrate(
		&User{},           // 用户表
		&SocialAccount{},  // 社交账号表
		&UserPreference{}, // 用户偏好设置表
	)
	if err != nil {
		log.Printf("数据库迁移失败: %v", err)
		return err
	}

	log.Println("数据库迁移成功")
	return nil
}
