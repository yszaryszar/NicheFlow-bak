// Package service 提供了应用的核心业务逻辑服务
package service

import (
	"context"
	"errors"
	"time"

	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
	"gorm.io/gorm"
)

// UserService 提供用户相关的业务逻辑服务
// 包括用户信息管理、使用统计、订阅管理等功能
type UserService struct {
	db *gorm.DB
}

// NewUserService 创建一个新的用户服务实例
// 返回 UserService 实例，用于处理用户相关的业务逻辑
func NewUserService() *UserService {
	return &UserService{
		db: database.GetDB(),
	}
}

// GetUserByClerkID 通过 Clerk ID 获取用户信息
//
// 参数:
//   - ctx: 上下文对象，用于控制请求的生命周期
//   - clerkID: Clerk 平台的用户唯一标识
//
// 返回:
//   - *model.User: 用户信息
//   - error: 错误信息，如果没有错误则为 nil
func (s *UserService) GetUserByClerkID(ctx context.Context, clerkID string) (*model.User, error) {
	var user model.User
	if err := s.db.Where("clerk_id = ?", clerkID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// CreateUser 创建新用户
//
// 参数:
//   - ctx: 上下文对象
//   - user: 要创建的用户信息
//
// 返回:
//   - error: 创建过程中的错误信息，如果成功则为 nil
func (s *UserService) CreateUser(ctx context.Context, user *model.User) error {
	return s.db.Create(user).Error
}

// UpdateUser 更新用户信息
//
// 参数:
//   - ctx: 上下文对象
//   - user: 包含更新信息的用户对象
//
// 返回:
//   - error: 更新过程中的错误信息，如果成功则为 nil
func (s *UserService) UpdateUser(ctx context.Context, user *model.User) error {
	return s.db.Save(user).Error
}

// UpdateUserPreferences 更新用户偏好设置
//
// 参数:
//   - ctx: 上下文对象
//   - clerkID: 用户的 Clerk ID
//   - language: 用户选择的语言
//   - theme: 用户选择的主题
//
// 返回:
//   - error: 更新过程中的错误信息，如果成功则为 nil
func (s *UserService) UpdateUserPreferences(ctx context.Context, clerkID string, language, theme string) error {
	return s.db.Model(&model.User{}).
		Where("clerk_id = ?", clerkID).
		Updates(map[string]interface{}{
			"language": language,
			"theme":    theme,
		}).Error
}

// GetUserUsage 获取用户使用统计信息
//
// 参数:
//   - ctx: 上下文对象
//   - clerkID: 用户的 Clerk ID
//
// 返回:
//   - *model.User: 包含使用统计信息的用户对象
//   - error: 获取过程中的错误信息，如果成功则为 nil
func (s *UserService) GetUserUsage(ctx context.Context, clerkID string) (*model.User, error) {
	var user model.User
	if err := s.db.Select("usage_limit, usage_count, monthly_limit, monthly_count, last_reset_time").
		Where("clerk_id = ?", clerkID).
		First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// IncrementUsage 增加用户使用次数
// 该方法会检查用户的使用限制，并在必要时重置月度使用统计
//
// 参数:
//   - ctx: 上下文对象
//   - clerkID: 用户的 Clerk ID
//
// 返回:
//   - error: 操作过程中的错误信息，如果成功则为 nil
func (s *UserService) IncrementUsage(ctx context.Context, clerkID string) error {
	user, err := s.GetUserByClerkID(ctx, clerkID)
	if err != nil {
		return err
	}

	// 检查是否需要重置月度使用量
	now := time.Now()
	if now.Year() > user.LastResetTime.Year() || now.Month() > user.LastResetTime.Month() {
		user.MonthlyCount = 0
		user.LastResetTime = now
	}

	// 检查使用限制
	if user.UsageCount >= user.UsageLimit {
		return errors.New("超出总使用限制")
	}
	if user.MonthlyCount >= user.MonthlyLimit {
		return errors.New("超出月度使用限制")
	}

	// 更新使用次数
	return s.db.Model(&model.User{}).
		Where("clerk_id = ?", clerkID).
		Updates(map[string]interface{}{
			"usage_count":     gorm.Expr("usage_count + 1"),
			"monthly_count":   gorm.Expr("monthly_count + 1"),
			"last_reset_time": user.LastResetTime,
		}).Error
}

// GetUserSubscription 获取用户订阅信息
//
// 参数:
//   - ctx: 上下文对象
//   - clerkID: 用户的 Clerk ID
//
// 返回:
//   - *model.User: 包含订阅信息的用户对象
//   - error: 获取过程中的错误信息，如果成功则为 nil
func (s *UserService) GetUserSubscription(ctx context.Context, clerkID string) (*model.User, error) {
	var user model.User
	if err := s.db.Select(
		"subscription_id, subscription_plan, subscription_status, subscription_start, subscription_end, trial_end",
	).Where("clerk_id = ?", clerkID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateUserSubscription 更新用户订阅信息
//
// 参数:
//   - ctx: 上下文对象
//   - clerkID: 用户的 Clerk ID
//   - subscription: 包含新订阅信息的用户对象
//
// 返回:
//   - error: 更新过程中的错误信息，如果成功则为 nil
func (s *UserService) UpdateUserSubscription(ctx context.Context, clerkID string, subscription *model.User) error {
	return s.db.Model(&model.User{}).
		Where("clerk_id = ?", clerkID).
		Updates(map[string]interface{}{
			"subscription_id":     subscription.SubscriptionID,
			"subscription_plan":   subscription.SubscriptionPlan,
			"subscription_status": subscription.SubscriptionStatus,
			"subscription_start":  subscription.SubscriptionStart,
			"subscription_end":    subscription.SubscriptionEnd,
			"trial_end":           subscription.TrialEnd,
		}).Error
}
