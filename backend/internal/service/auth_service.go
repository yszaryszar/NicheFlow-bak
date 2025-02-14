// Package service 提供应用的业务逻辑服务层
// 包含认证、用户管理、OAuth等核心业务逻辑的实现
package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
	"gorm.io/gorm"
)

// AuthService 认证服务
// 提供用户认证、会话管理、OAuth账号管理等功能
// 集成了 OAuth 服务用于第三方认证
type AuthService struct {
	db    *gorm.DB      // 数据库连接实例
	oauth *OAuthService // OAuth 服务实例
}

// NewAuthService 创建认证服务实例
//
// 参数:
//   - oauth: OAuth 服务实例，用于处理第三方认证
//
// 返回:
//   - *AuthService: 认证服务实例
func NewAuthService(oauth *OAuthService) *AuthService {
	return &AuthService{
		db:    database.GetDB(),
		oauth: oauth,
	}
}

// CreateSession 创建用户会话
//
// 参数:
//   - ctx: 上下文
//   - userID: 用户ID
//   - expiresAt: 会话过期时间
//
// 返回:
//   - *model.Session: 创建的会话信息
//   - error: 创建过程中的错误，如果成功则为 nil
//
// 说明:
//
//	生成唯一的会话ID和令牌
//	在数据库中创建会话记录
func (s *AuthService) CreateSession(ctx context.Context, userID uint, expiresAt time.Time) (*model.Session, error) {
	sessionID := fmt.Sprintf("sess_%d", time.Now().UnixNano())
	sessionToken := fmt.Sprintf("token_%d", time.Now().UnixNano())

	session := &model.Session{
		ID:           sessionID,
		UserID:       userID,
		ExpiresAt:    expiresAt,
		SessionToken: sessionToken,
	}

	if err := s.db.Create(session).Error; err != nil {
		return nil, err
	}

	return session, nil
}

// GetSessionByToken 通过会话令牌获取会话信息
//
// 参数:
//   - ctx: 上下文
//   - token: 会话令牌
//
// 返回:
//   - *model.Session: 会话信息，包含关联的用户数据
//   - error: 查询过程中的错误，如果成功则为 nil
//
// 说明:
//
//	只返回未过期的会话
//	预加载关联的用户信息
func (s *AuthService) GetSessionByToken(ctx context.Context, token string) (*model.Session, error) {
	var session model.Session
	if err := s.db.Where("session_token = ? AND expires_at > ?", token, time.Now()).
		Preload("User").First(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

// CreateAccount 创建 OAuth 账号
//
// 参数:
//   - ctx: 上下文
//   - account: OAuth 账号信息
//
// 返回:
//   - error: 创建过程中的错误，如果成功则为 nil
//
// 说明:
//
//	在数据库中创建 OAuth 账号记录
//	关联到对应的用户
func (s *AuthService) CreateAccount(ctx context.Context, account *model.Account) error {
	return s.db.Create(account).Error
}

// GetAccountByProvider 获取 OAuth 账号信息
//
// 参数:
//   - ctx: 上下文
//   - provider: OAuth 提供商（如 Google、GitHub）
//   - providerID: 提供商的用户ID
//
// 返回:
//   - *model.Account: OAuth 账号信息，包含关联的用户数据
//   - error: 查询过程中的错误，如果成功则为 nil
//
// 说明:
//
//	通过提供商和提供商用户ID查询账号
//	预加载关联的用户信息
func (s *AuthService) GetAccountByProvider(ctx context.Context, provider, providerID string) (*model.Account, error) {
	var account model.Account
	if err := s.db.Where("provider = ? AND provider_id = ?", provider, providerID).
		Preload("User").First(&account).Error; err != nil {
		return nil, err
	}
	return &account, nil
}

// CreateUser 创建新用户
//
// 参数:
//   - ctx: 上下文
//   - user: 用户信息
//
// 返回:
//   - error: 创建过程中的错误，如果成功则为 nil
//
// 说明:
//
//	在数据库中创建用户记录
//	设置默认的用户属性
func (s *AuthService) CreateUser(ctx context.Context, user *model.User) error {
	return s.db.Create(user).Error
}

// GetUserByEmail 通过邮箱获取用户信息
//
// 参数:
//   - ctx: 上下文
//   - email: 用户邮箱
//
// 返回:
//   - *model.User: 用户信息
//   - error: 查询过程中的错误，如果成功则为 nil
//
// 说明:
//
//	通过邮箱查询用户记录
//	如果用户不存在，返回 gorm.ErrRecordNotFound
func (s *AuthService) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateVerificationToken 创建邮箱验证令牌
//
// 参数:
//   - ctx: 上下文
//   - email: 待验证的邮箱
//   - expiresAt: 令牌过期时间
//
// 返回:
//   - *model.VerificationToken: 验证令牌信息
//   - error: 创建过程中的错误，如果成功则为 nil
//
// 说明:
//
//	生成邮箱验证令牌
//	设置过期时间
func (s *AuthService) CreateVerificationToken(ctx context.Context, email string, expiresAt time.Time) (*model.VerificationToken, error) {
	token := &model.VerificationToken{
		Email:     email,
		ExpiresAt: expiresAt,
	}

	if err := s.db.Create(token).Error; err != nil {
		return nil, err
	}

	return token, nil
}

// VerifyEmail 验证用户邮箱
//
// 参数:
//   - ctx: 上下文
//   - token: 验证令牌
//
// 返回:
//   - error: 验证过程中的错误，如果成功则为 nil
//
// 说明:
//
//	验证令牌的有效性
//	更新用户的邮箱验证状态
//	删除已使用的验证令牌
func (s *AuthService) VerifyEmail(ctx context.Context, token string) error {
	var verificationToken model.VerificationToken
	if err := s.db.Where("token = ? AND expires_at > ?", token, time.Now()).
		First(&verificationToken).Error; err != nil {
		return err
	}

	if err := s.db.Model(&model.User{}).
		Where("email = ?", verificationToken.Email).
		Update("email_verified", time.Now()).Error; err != nil {
		return err
	}

	return s.db.Delete(&verificationToken).Error
}

// UpdateProviderAccount 更新 OAuth 账号信息
//
// 参数:
//   - ctx: 上下文
//   - account: 更新的 OAuth 账号信息
//
// 返回:
//   - error: 更新过程中的错误，如果成功则为 nil
//
// 说明:
//
//	序列化提供商账号信息
//	更新数据库中的账号记录
func (s *AuthService) UpdateProviderAccount(ctx context.Context, account *model.Account) error {
	providerAccount, err := json.Marshal(account.ProviderAccount)
	if err != nil {
		return err
	}
	account.ProviderAccount = string(providerAccount)

	return s.db.Save(account).Error
}

// DeleteSession 删除会话
//
// 参数:
//   - ctx: 上下文
//   - sessionToken: 会话令牌
//
// 返回:
//   - error: 删除过程中的错误，如果成功则为 nil
//
// 说明:
//
//	通过会话令牌删除会话记录
//	用于用户登出或会话失效时
func (s *AuthService) DeleteSession(ctx context.Context, sessionToken string) error {
	return s.db.Where("session_token = ?", sessionToken).Delete(&model.Session{}).Error
}

// CleanExpiredSessions 清理过期会话
//
// 参数:
//   - ctx: 上下文
//
// 返回:
//   - error: 清理过程中的错误，如果成功则为 nil
//
// 说明:
//
//	删除所有过期的会话记录
//	用于定期维护数据库
func (s *AuthService) CleanExpiredSessions(ctx context.Context) error {
	return s.db.Where("expires_at < ?", time.Now()).Delete(&model.Session{}).Error
}

// ValidateSession 验证会话有效性
//
// 参数:
//   - ctx: 上下文
//   - sessionToken: 会话令牌
//
// 返回:
//   - *model.Session: 有效的会话信息
//   - error: 验证过程中的错误，如果成功则为 nil
//
// 说明:
//
//	检查会话是否存在
//	验证会话是否过期
//	返回有效的会话信息
func (s *AuthService) ValidateSession(ctx context.Context, sessionToken string) (*model.Session, error) {
	session, err := s.GetSessionByToken(ctx, sessionToken)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("会话不存在或已过期")
		}
		return nil, err
	}

	if session.ExpiresAt.Before(time.Now()) {
		return nil, errors.New("会话已过期")
	}

	return session, nil
}

// HandleOAuthCallback 处理 OAuth 回调
//
// 参数:
//   - ctx: 上下文
//   - provider: OAuth 提供商
//   - code: 授权码
//
// 返回:
//   - *model.User: 用户信息
//   - error: 处理过程中的错误，如果成功则为 nil
//
// 说明:
//
//	交换授权码获取访问令牌
//	获取用户信息
//	创建或更新用户记录
//	处理 OAuth 账号关联
func (s *AuthService) HandleOAuthCallback(ctx context.Context, provider, code string) (*model.User, error) {
	token, err := s.oauth.ExchangeCode(ctx, provider, code)
	if err != nil {
		return nil, fmt.Errorf("交换令牌失败: %w", err)
	}

	user, err := s.oauth.GetUserInfo(ctx, provider, token)
	if err != nil {
		return nil, fmt.Errorf("获取用户信息失败: %w", err)
	}

	existingUser, err := s.GetUserByEmail(ctx, user.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("查询用户失败: %w", err)
	}

	if existingUser != nil {
		existingUser.Username = user.Username
		existingUser.FirstName = user.FirstName
		existingUser.LastName = user.LastName
		existingUser.ImageURL = user.ImageURL
		existingUser.LastSignInAt = time.Now()
		if err := s.db.Save(existingUser).Error; err != nil {
			return nil, fmt.Errorf("更新用户信息失败: %w", err)
		}
		return existingUser, nil
	}

	if err := s.CreateUser(ctx, user); err != nil {
		return nil, fmt.Errorf("创建用户失败: %w", err)
	}

	return user, nil
}
