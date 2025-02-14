// Package model 提供了应用的数据模型定义
package model

import (
	"log"

	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

// AutoMigrate 自动迁移数据库表结构
// 根据模型定义自动创建或更新数据库表
//
// 执行以下操作：
// 1. 检查数据库连接
// 2. 自动创建或更新表结构
// 3. 添加或更新索引
// 4. 处理模型关系
//
// 支持的模型：
// - User: 用户模型，存储用户基本信息和认证状态
//
// 返回:
//   - error: 迁移过程中的错误，如果成功则为 nil
func AutoMigrate() error {
	db := database.GetDB()
	if db == nil {
		log.Fatal("数据库连接未初始化")
	}

	// 自动迁移表结构
	err := db.AutoMigrate(
		&User{}, // 用户表
	)
	if err != nil {
		log.Printf("数据库迁移失败: %v", err)
		return err
	}

	log.Println("数据库迁移成功")
	return nil
}
