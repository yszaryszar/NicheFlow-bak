// Package model 提供了应用的数据模型定义
// 包含用户、会话、账号等核心数据结构的定义和相关方法
package model

import (
	"time"

	"gorm.io/gorm"
)

// User 用户模型
// 存储用户的基本信息、认证状态、订阅信息和使用限制等
// 该模型与 Clerk 认证服务集成，同时支持本地用户管理
type User struct {
	// 基础字段
	ID        uint           `gorm:"primarykey" json:"id"` // 用户唯一标识
	CreatedAt time.Time      `json:"created_at"`           // 创建时间
	UpdatedAt time.Time      `json:"updated_at"`           // 更新时间
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`       // 软删除时间

	// Clerk 用户基础信息
	ClerkID       string    `gorm:"type:varchar(100);uniqueIndex" json:"clerk_id"` // Clerk 平台用户ID
	Email         string    `gorm:"type:varchar(100);uniqueIndex" json:"email"`    // 用户邮箱
	Username      string    `gorm:"type:varchar(50)" json:"username"`              // 用户名
	FirstName     string    `gorm:"type:varchar(50)" json:"first_name"`            // 名
	LastName      string    `gorm:"type:varchar(50)" json:"last_name"`             // 姓
	ImageURL      string    `gorm:"type:varchar(255)" json:"image_url"`            // 头像URL
	EmailVerified bool      `gorm:"default:false" json:"email_verified"`           // 邮箱是否验证
	PhoneNumber   string    `gorm:"type:varchar(20)" json:"phone_number"`          // 电话号码
	PhoneVerified bool      `gorm:"default:false" json:"phone_verified"`           // 电话是否验证
	LastSignInAt  time.Time `json:"last_sign_in_at"`                               // 最后登录时间

	// 用户偏好设置
	Language string `gorm:"type:varchar(10);default:'zh'" json:"language"` // 界面语言
	Theme    string `gorm:"type:varchar(10);default:'light'" json:"theme"` // 界面主题

	// 用户状态
	Role   string `gorm:"type:varchar(20);default:'user'" json:"role"`     // 用户角色
	Status string `gorm:"type:varchar(20);default:'active'" json:"status"` // 账号状态

	// 订阅相关
	SubscriptionID     string     `gorm:"type:varchar(100)" json:"subscription_id"`    // 订阅ID
	SubscriptionPlan   string     `gorm:"type:varchar(20)" json:"subscription_plan"`   // 订阅计划
	SubscriptionStatus string     `gorm:"type:varchar(20)" json:"subscription_status"` // 订阅状态
	SubscriptionStart  *time.Time `json:"subscription_start,omitempty"`                // 订阅开始时间
	SubscriptionEnd    *time.Time `json:"subscription_end,omitempty"`                  // 订阅结束时间
	TrialEnd           *time.Time `json:"trial_end,omitempty"`                         // 试用期结束时间

	// 使用限制
	UsageLimit    int       `gorm:"default:5" json:"usage_limit"`   // API总使用限制
	UsageCount    int       `gorm:"default:0" json:"usage_count"`   // API已使用次数
	MonthlyLimit  int       `gorm:"default:3" json:"monthly_limit"` // 每月API使用限制
	MonthlyCount  int       `gorm:"default:0" json:"monthly_count"` // 当月API已使用次数
	LastResetTime time.Time `json:"last_reset_time"`                // 使用量上次重置时间
}

// TableName 指定用户表名
// 实现 gorm.Tabler 接口，自定义表名
func (User) TableName() string {
	return "users"
}
