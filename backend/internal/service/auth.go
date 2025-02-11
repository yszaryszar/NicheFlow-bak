package service

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
	"gorm.io/gorm"
)

// AuthService 认证服务
type AuthService struct {
	db *gorm.DB
}

// NewAuthService 创建认证服务实例
func NewAuthService() *AuthService {
	return &AuthService{
		db: database.GetDB(),
	}
}

// CreateSession 创建会话
func (s *AuthService) CreateSession(ctx context.Context, userID uint, expiresAt time.Time) (*model.Session, error) {
	session := &model.Session{
		UserID:    userID,
		ExpiresAt: expiresAt,
	}

	if err := s.db.Create(session).Error; err != nil {
		return nil, err
	}

	return session, nil
}

// GetSessionByToken 通过 Token 获取会话
func (s *AuthService) GetSessionByToken(ctx context.Context, token string) (*model.Session, error) {
	var session model.Session
	if err := s.db.Where("session_token = ? AND expires_at > ?", token, time.Now()).
		Preload("User").First(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

// CreateAccount 创建 OAuth 账号
func (s *AuthService) CreateAccount(ctx context.Context, account *model.Account) error {
	return s.db.Create(account).Error
}

// GetAccountByProvider 获取 OAuth 账号
func (s *AuthService) GetAccountByProvider(ctx context.Context, provider, providerID string) (*model.Account, error) {
	var account model.Account
	if err := s.db.Where("provider = ? AND provider_id = ?", provider, providerID).
		Preload("User").First(&account).Error; err != nil {
		return nil, err
	}
	return &account, nil
}

// CreateUser 创建用户
func (s *AuthService) CreateUser(ctx context.Context, user *model.User) error {
	return s.db.Create(user).Error
}

// GetUserByEmail 通过邮箱获取用户
func (s *AuthService) GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateVerificationToken 创建邮箱验证 Token
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

// VerifyEmail 验证邮箱
func (s *AuthService) VerifyEmail(ctx context.Context, token string) error {
	var verificationToken model.VerificationToken
	if err := s.db.Where("token = ? AND expires_at > ?", token, time.Now()).
		First(&verificationToken).Error; err != nil {
		return err
	}

	// 更新用户邮箱验证状态
	if err := s.db.Model(&model.User{}).
		Where("email = ?", verificationToken.Email).
		Update("email_verified", time.Now()).Error; err != nil {
		return err
	}

	// 删除已使用的 token
	return s.db.Delete(&verificationToken).Error
}

// UpdateProviderAccount 更新 OAuth 账号信息
func (s *AuthService) UpdateProviderAccount(ctx context.Context, account *model.Account) error {
	// 序列化提供商账号数据
	providerAccount, err := json.Marshal(account.ProviderAccount)
	if err != nil {
		return err
	}
	account.ProviderAccount = string(providerAccount)

	return s.db.Save(account).Error
}

// DeleteSession 删除会话
func (s *AuthService) DeleteSession(ctx context.Context, sessionToken string) error {
	return s.db.Where("session_token = ?", sessionToken).Delete(&model.Session{}).Error
}

// CleanExpiredSessions 清理过期会话
func (s *AuthService) CleanExpiredSessions(ctx context.Context) error {
	return s.db.Where("expires_at < ?", time.Now()).Delete(&model.Session{}).Error
}

// ValidateSession 验证会话是否有效
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
