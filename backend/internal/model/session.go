package model

import (
	"time"

	"gorm.io/gorm"
)

// Session Auth.js 会话模型
type Session struct {
	ID           string         `gorm:"primarykey;type:varchar(100)" json:"id"`
	UserID       uint           `gorm:"index" json:"user_id"`
	ExpiresAt    time.Time      `json:"expires_at"`
	SessionToken string         `gorm:"type:varchar(255);uniqueIndex" json:"-"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	// 关联用户
	User User `gorm:"foreignKey:UserID" json:"user"`
}

// Account OAuth 账号模型
type Account struct {
	ID              string         `gorm:"primarykey;type:varchar(100)" json:"id"`
	UserID          uint           `gorm:"index" json:"user_id"`
	Type            string         `gorm:"type:varchar(20)" json:"type"`         // oauth, email, credentials
	Provider        string         `gorm:"type:varchar(20)" json:"provider"`     // google, github, etc.
	ProviderID      string         `gorm:"type:varchar(100)" json:"provider_id"` // 提供商的用户ID
	ProviderAccount string         `gorm:"type:text" json:"-"`                   // 提供商的账号数据(JSON)
	RefreshToken    string         `gorm:"type:text" json:"-"`                   // OAuth refresh token
	AccessToken     string         `gorm:"type:text" json:"-"`                   // OAuth access token
	ExpiresAt       *time.Time     `json:"expires_at,omitempty"`                 // Token 过期时间
	TokenType       string         `gorm:"type:varchar(20)" json:"-"`            // Token 类型
	Scope           string         `gorm:"type:text" json:"-"`                   // OAuth scope
	IDToken         string         `gorm:"type:text" json:"-"`                   // OAuth ID token
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	// 关联用户
	User User `gorm:"foreignKey:UserID" json:"user"`
}

// VerificationToken 邮箱验证 Token
type VerificationToken struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Token     string         `gorm:"type:varchar(255);uniqueIndex" json:"-"`
	Email     string         `gorm:"type:varchar(100);index" json:"email"`
	ExpiresAt time.Time      `json:"expires_at"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
