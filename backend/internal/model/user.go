package model

import (
	"time"

	"gorm.io/gorm"
)

// User 用户模型
type User struct {
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
	Language string `gorm:"type:varchar(10);default:'zh'" json:"language"`
	Theme    string `gorm:"type:varchar(10);default:'light'" json:"theme"`

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
	UsageLimit    int       `gorm:"default:5" json:"usage_limit"`   // 总使用限制
	UsageCount    int       `gorm:"default:0" json:"usage_count"`   // 已使用次数
	MonthlyLimit  int       `gorm:"default:3" json:"monthly_limit"` // 每月限制
	MonthlyCount  int       `gorm:"default:0" json:"monthly_count"` // 当月已使用
	LastResetTime time.Time `json:"last_reset_time"`                // 上次重置时间
}

// TableName 指定表名
func (User) TableName() string {
	return "users"
}
