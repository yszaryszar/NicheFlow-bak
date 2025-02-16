// Package model 提供了应用的数据模型定义
// 包含用户、会话、账号等核心数据结构的定义和相关方法
package model

import (
	"time"

	"gorm.io/gorm"
)

// SocialAccount 社交账号信息
type SocialAccount struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	UserID    uint       `gorm:"index" json:"user_id"`                     // 关联的用户ID
	Provider  string     `gorm:"type:varchar(20)" json:"provider"`         // 提供商(google/apple/x)
	AccountID string     `gorm:"type:varchar(100)" json:"account_id"`      // 第三方账号ID
	Email     string     `gorm:"type:varchar(100)" json:"email,omitempty"` // 账号邮箱
	Username  string     `gorm:"type:varchar(50)" json:"username"`         // 账号用户名
	AvatarURL string     `gorm:"type:varchar(255)" json:"avatar_url"`      // 账号头像
	IsActive  bool       `gorm:"default:true" json:"is_active"`            // 是否活跃
	LastUsed  *time.Time `json:"last_used,omitempty"`                      // 最后使用时间
}

// UserPreference 用户偏好设置
type UserPreference struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	UserID uint   `gorm:"index" json:"user_id"`           // 关联的用户ID
	Key    string `gorm:"type:varchar(50)" json:"key"`    // 偏好设置键
	Value  string `gorm:"type:varchar(255)" json:"value"` // 偏好设置值
}

// User 用户模型
// 存储用户的基本信息、认证状态、订阅信息和使用限制等
// 该模型与 Clerk 认证服务集成，同时支持本地用户管理
type User struct {
	// 基础字段
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Clerk 用户基础信息
	ClerkID       string    `gorm:"type:varchar(100);uniqueIndex" json:"clerk_id"`
	Email         string    `gorm:"type:varchar(100);uniqueIndex" json:"email"`
	Username      string    `gorm:"type:varchar(50)" json:"username"`
	FirstName     string    `gorm:"type:varchar(50)" json:"first_name"`
	LastName      string    `gorm:"type:varchar(50)" json:"last_name"`
	ImageURL      string    `gorm:"type:varchar(255)" json:"image_url"`
	EmailVerified bool      `gorm:"default:false" json:"email_verified"`
	PhoneNumber   string    `gorm:"type:varchar(20)" json:"phone_number"`
	PhoneVerified bool      `gorm:"default:false" json:"phone_verified"`
	LastSignInAt  time.Time `json:"last_sign_in_at"`

	// 用户偏好设置
	Language           string `gorm:"type:varchar(10);default:'zh'" json:"language"`
	Theme              string `gorm:"type:varchar(10);default:'light'" json:"theme"`
	TimeZone           string `gorm:"type:varchar(50);default:'Asia/Shanghai'" json:"time_zone"`
	DateFormat         string `gorm:"type:varchar(20);default:'YYYY-MM-DD'" json:"date_format"`
	TimeFormat         string `gorm:"type:varchar(20);default:'HH:mm'" json:"time_format"`
	NotificationEmail  bool   `gorm:"default:true" json:"notification_email"`
	NotificationMobile bool   `gorm:"default:true" json:"notification_mobile"`
	NotificationWeb    bool   `gorm:"default:true" json:"notification_web"`

	// 用户状态
	Role   string `gorm:"type:varchar(20);default:'user'" json:"role"`
	Status string `gorm:"type:varchar(20);default:'active'" json:"status"`

	// 订阅相关
	SubscriptionID     string     `gorm:"type:varchar(100)" json:"subscription_id"`
	SubscriptionPlan   string     `gorm:"type:varchar(20)" json:"subscription_plan"`
	SubscriptionStatus string     `gorm:"type:varchar(20)" json:"subscription_status"`
	SubscriptionStart  *time.Time `json:"subscription_start,omitempty"`
	SubscriptionEnd    *time.Time `json:"subscription_end,omitempty"`
	TrialEnd           *time.Time `json:"trial_end,omitempty"`

	// 使用限制
	UsageLimit    int       `gorm:"default:5" json:"usage_limit"`
	UsageCount    int       `gorm:"default:0" json:"usage_count"`
	MonthlyLimit  int       `gorm:"default:3" json:"monthly_limit"`
	MonthlyCount  int       `gorm:"default:0" json:"monthly_count"`
	LastResetTime time.Time `json:"last_reset_time"`

	// 关联
	SocialAccounts []SocialAccount  `gorm:"foreignKey:UserID" json:"social_accounts,omitempty"`
	Preferences    []UserPreference `gorm:"foreignKey:UserID" json:"preferences,omitempty"`
}

// TableName 指定用户表名
func (User) TableName() string {
	return "users"
}

// TableName 指定社交账号表名
func (SocialAccount) TableName() string {
	return "social_accounts"
}

// TableName 指定用户偏好设置表名
func (UserPreference) TableName() string {
	return "user_preferences"
}
