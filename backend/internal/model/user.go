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

	Email         string    `gorm:"type:varchar(100);uniqueIndex" json:"email"`
	Name          string    `gorm:"type:varchar(50)" json:"name"`
	Image         string    `gorm:"type:varchar(255)" json:"image"`
	EmailVerified time.Time `json:"email_verified,omitempty"`

	// OAuth 相关字段
	Provider        string `gorm:"type:varchar(20)" json:"-"`
	ProviderID      string `gorm:"type:varchar(100)" json:"-"`
	ProviderAccount string `gorm:"type:text" json:"-"`

	// 用户角色和状态
	Role   string `gorm:"type:varchar(20);default:'user'" json:"role"`
	Status string `gorm:"type:varchar(20);default:'active'" json:"status"`

	// 订阅相关
	SubscriptionID     string     `gorm:"type:varchar(100)" json:"-"`
	SubscriptionStatus string     `gorm:"type:varchar(20)" json:"subscription_status"`
	SubscriptionEnd    *time.Time `json:"subscription_end,omitempty"`

	// 使用限制
	UsageLimit    int       `gorm:"default:5" json:"usage_limit"`   // 总使用限制
	UsageCount    int       `gorm:"default:0" json:"usage_count"`   // 已使用次数
	MonthlyLimit  int       `gorm:"default:3" json:"monthly_limit"` // 每月限制
	MonthlyCount  int       `gorm:"default:0" json:"monthly_count"` // 当月已使用
	LastResetTime time.Time `json:"last_reset_time"`                // 上次重置时间
}
