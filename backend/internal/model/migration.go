// Package model 提供了应用的数据模型定义
package model

import (
	"log"

	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

// AutoMigrate 自动迁移数据库结构
// 该函数在应用启动时执行，确保数据库结构与模型定义同步
//
// 执行以下操作：
// 1. 检查数据库连接
// 2. 自动创建或更新表结构
// 3. 添加或更新索引
// 4. 处理模型关系
//
// 支持的模型：
// - User: 用户模型
// - Session: 会话模型
// - Account: OAuth账号模型
// - VerificationToken: 验证令牌模型
//
// 返回:
//   - error: 迁移过程中的错误，如果成功则为 nil
func AutoMigrate() error {
	db := database.GetDB()
	if db == nil {
		log.Fatal("数据库连接未初始化")
	}

	// 自动迁移表结构
	// 按照依赖关系顺序执行迁移
	err := db.AutoMigrate(
		&User{},              // 用户表
		&Session{},           // 会话表
		&Account{},           // OAuth账号表
		&VerificationToken{}, // 验证令牌表
	)
	if err != nil {
		log.Printf("数据库迁移失败: %v", err)
		return err
	}

	log.Println("数据库迁移成功")
	return nil
}
