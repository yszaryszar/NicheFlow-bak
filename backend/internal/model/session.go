// Package model 提供了应用的数据模型定义
package model

import (
	"time"

	"gorm.io/gorm"
)

// Session Auth.js 会话模型
// 用于存储用户会话信息，支持多端登录和会话管理
// 与 Auth.js 认证框架集成，提供标准的会话管理功能
type Session struct {
	ID           string         `gorm:"primarykey;type:varchar(100)" json:"id"` // 会话唯一标识
	UserID       uint           `gorm:"index" json:"user_id"`                   // 关联的用户ID
	ExpiresAt    time.Time      `json:"expires_at"`                             // 会话过期时间
	SessionToken string         `gorm:"type:varchar(255);uniqueIndex" json:"-"` // 会话令牌
	CreatedAt    time.Time      `json:"created_at"`                             // 创建时间
	UpdatedAt    time.Time      `json:"updated_at"`                             // 更新时间
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`                         // 软删除时间

	// 关联用户
	User User `gorm:"foreignKey:UserID" json:"user"` // 关联的用户信息
}

// Account OAuth 账号模型
// 用于存储用户的 OAuth 认证信息
// 支持多个第三方认证提供商（如 Google、GitHub 等）
type Account struct {
	ID              string         `gorm:"primarykey;type:varchar(100)" json:"id"` // 账号唯一标识
	UserID          uint           `gorm:"index" json:"user_id"`                   // 关联的用户ID
	Type            string         `gorm:"type:varchar(20)" json:"type"`           // 认证类型：oauth, email, credentials
	Provider        string         `gorm:"type:varchar(20)" json:"provider"`       // 认证提供商：google, github 等
	ProviderID      string         `gorm:"type:varchar(100)" json:"provider_id"`   // 提供商的用户ID
	ProviderAccount string         `gorm:"type:text" json:"-"`                     // 提供商的账号数据(JSON)
	RefreshToken    string         `gorm:"type:text" json:"-"`                     // OAuth 刷新令牌
	AccessToken     string         `gorm:"type:text" json:"-"`                     // OAuth 访问令牌
	ExpiresAt       *time.Time     `json:"expires_at,omitempty"`                   // 令牌过期时间
	TokenType       string         `gorm:"type:varchar(20)" json:"-"`              // 令牌类型
	Scope           string         `gorm:"type:text" json:"-"`                     // OAuth 授权范围
	IDToken         string         `gorm:"type:text" json:"-"`                     // OAuth ID 令牌
	CreatedAt       time.Time      `json:"created_at"`                             // 创建时间
	UpdatedAt       time.Time      `json:"updated_at"`                             // 更新时间
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`                         // 软删除时间

	// 关联用户
	User User `gorm:"foreignKey:UserID" json:"user"` // 关联的用户信息
}

// VerificationToken 邮箱验证令牌
// 用于邮箱验证流程，存储验证令牌信息
type VerificationToken struct {
	ID        uint           `gorm:"primarykey" json:"id"`                   // 令牌唯一标识
	Token     string         `gorm:"type:varchar(255);uniqueIndex" json:"-"` // 验证令牌
	Email     string         `gorm:"type:varchar(100);index" json:"email"`   // 待验证的邮箱
	ExpiresAt time.Time      `json:"expires_at"`                             // 令牌过期时间
	CreatedAt time.Time      `json:"created_at"`                             // 创建时间
	UpdatedAt time.Time      `json:"updated_at"`                             // 更新时间
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`                         // 软删除时间
}
