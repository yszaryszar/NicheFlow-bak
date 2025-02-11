package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
	"github.com/yszaryszar/NicheFlow/backend/pkg/response"
	"gorm.io/gorm"
)

// ProviderResponse OAuth 提供商响应
type ProviderResponse struct {
	ID     string   `json:"id" example:"google"`
	Name   string   `json:"name" example:"Google"`
	Type   string   `json:"type" example:"oauth"`
	Scopes []string `json:"scopes" example:"profile,email"`
}

// AuthResponse 认证响应
type AuthResponse struct {
	Session     *model.Session `json:"session"`
	User        *model.User    `json:"user"`
	AccessToken string         `json:"access_token"`
}

// MessageResponse 消息响应
type MessageResponse struct {
	Message string `json:"message" example:"操作成功"`
}

// ErrorResponse 错误响应
type ErrorResponse struct {
	Error string `json:"error" example:"操作失败"`
}

// AuthHandler 认证处理器
type AuthHandler struct {
	authService  *service.AuthService
	oauthService *service.OAuthService
	cfg          *config.Config
}

// NewAuthHandler 创建认证处理器实例
func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		authService:  service.NewAuthService(),
		oauthService: service.NewOAuthService(cfg),
		cfg:          cfg,
	}
}

// HandleProviders godoc
// @Summary 获取认证提供商列表
// @Description 获取所有可用的 OAuth 认证提供商
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {array} ProviderResponse
// @Router /auth/providers [get]
func (h *AuthHandler) HandleProviders(c *gin.Context) {
	providers := []ProviderResponse{
		{
			ID:     "google",
			Name:   "Google",
			Type:   "oauth",
			Scopes: h.cfg.OAuth.Google.Scopes,
		},
		{
			ID:     "github",
			Name:   "GitHub",
			Type:   "oauth",
			Scopes: h.cfg.OAuth.GitHub.Scopes,
		},
	}

	response.Success(c, gin.H{"providers": providers})
}

// HandleCallback godoc
// @Summary 处理 OAuth 回调
// @Description 处理 OAuth 认证回调，创建或更新用户会话
// @Tags auth
// @Accept json
// @Produce json
// @Param provider path string true "认证提供商" Enums(google,github)
// @Param code query string true "授权码"
// @Success 200 {object} AuthResponse
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /auth/callback/{provider} [get]
func (h *AuthHandler) HandleCallback(c *gin.Context) {
	provider := c.Param("provider")
	code := c.Query("code")
	if code == "" {
		response.ValidationError(c, "未提供授权码")
		return
	}

	// 验证提供商
	if provider != "google" && provider != "github" {
		response.ValidationError(c, "不支持的认证提供商")
		return
	}

	// 使用授权码交换令牌
	token, err := h.oauthService.ExchangeCode(c.Request.Context(), provider, code)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取令牌失败", err)
		return
	}

	// 获取用户信息
	user, err := h.oauthService.GetUserInfo(c.Request.Context(), provider, token)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取用户信息失败", err)
		return
	}

	// 查找或创建用户
	existingUser, err := h.authService.GetUserByEmail(c.Request.Context(), user.Email)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			response.Error(c, http.StatusInternalServerError, "查询用户失败", err)
			return
		}
		// 创建新用户
		if err := h.authService.CreateUser(c.Request.Context(), user); err != nil {
			response.Error(c, http.StatusInternalServerError, "创建用户失败", err)
			return
		}
		existingUser = user
	}

	// 创建或更新 OAuth 账号
	providerAccount, err := json.Marshal(token)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "序列化令牌失败", err)
		return
	}

	account := &model.Account{
		ID:              fmt.Sprintf("%s_%d", provider, time.Now().UnixNano()),
		UserID:          existingUser.ID,
		Type:            "oauth",
		Provider:        provider,
		ProviderAccount: string(providerAccount),
		AccessToken:     token["access_token"].(string),
	}

	// 设置 ProviderID
	if provider == "github" {
		if id, ok := token["id"].(float64); ok {
			account.ProviderID = fmt.Sprintf("%d", int64(id))
		}
	} else {
		if sub, ok := token["sub"].(string); ok {
			account.ProviderID = sub
		}
	}

	if refreshToken, ok := token["refresh_token"]; ok {
		account.RefreshToken = refreshToken.(string)
	}

	if expiresIn, ok := token["expires_in"].(float64); ok {
		expiresAt := time.Now().Add(time.Duration(expiresIn) * time.Second)
		account.ExpiresAt = &expiresAt
	}

	if err := h.authService.CreateAccount(c.Request.Context(), account); err != nil {
		response.Error(c, http.StatusInternalServerError, "保存账号信息失败", err)
		return
	}

	// 创建会话
	session, err := h.authService.CreateSession(c.Request.Context(), existingUser.ID, time.Now().Add(24*time.Hour))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "创建会话失败", err)
		return
	}

	response.Success(c, AuthResponse{
		Session:     session,
		User:        existingUser,
		AccessToken: session.SessionToken,
	})
}

// HandleSignOut godoc
// @Summary 用户登出
// @Description 删除用户会话，完成登出操作
// @Tags auth
// @Accept json
// @Produce json
// @Security Bearer
// @Success 200 {object} MessageResponse
// @Failure 401 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /auth/signout [post]
func (h *AuthHandler) HandleSignOut(c *gin.Context) {
	session, exists := c.Get("session")
	if !exists {
		response.UnauthorizedError(c, "未找到会话")
		return
	}

	// 类型断言
	sessionModel, ok := session.(*model.Session)
	if !ok {
		response.Error(c, http.StatusInternalServerError, "会话类型错误", nil)
		return
	}

	// 删除会话
	if err := h.authService.DeleteSession(c.Request.Context(), sessionModel.SessionToken); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除会话失败", err)
		return
	}

	response.Success(c, gin.H{"message": "退出成功"})
}

// HandleSession godoc
// @Summary 获取会话信息
// @Description 获取当前用户的会话信息
// @Tags auth
// @Accept json
// @Produce json
// @Security Bearer
// @Success 200 {object} model.User
// @Failure 401 {object} ErrorResponse
// @Router /auth/session [get]
func (h *AuthHandler) HandleSession(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		response.UnauthorizedError(c, "未找到用户")
		return
	}

	response.Success(c, gin.H{"user": user})
}

// HandleVerifyEmail godoc
// @Summary 验证邮箱
// @Description 验证用户邮箱地址
// @Tags auth
// @Accept json
// @Produce json
// @Param token query string true "验证令牌"
// @Success 200 {object} MessageResponse
// @Failure 400 {object} ErrorResponse
// @Router /auth/verify-email [get]
func (h *AuthHandler) HandleVerifyEmail(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		response.ValidationError(c, "未提供验证令牌")
		return
	}

	if err := h.authService.VerifyEmail(c.Request.Context(), token); err != nil {
		response.ValidationError(c, "验证失败")
		return
	}

	response.Success(c, gin.H{"message": "邮箱验证成功"})
}

// HandleAuthURL godoc
// @Summary 获取认证 URL
// @Description 获取指定提供商的认证 URL
// @Tags auth
// @Accept json
// @Produce json
// @Param provider path string true "认证提供商" Enums(google,github)
// @Success 200 {object} map[string]string
// @Failure 400 {object} ErrorResponse
// @Router /auth/url/{provider} [get]
func (h *AuthHandler) HandleAuthURL(c *gin.Context) {
	provider := c.Param("provider")
	if provider != "google" && provider != "github" {
		response.ValidationError(c, "不支持的认证提供商")
		return
	}

	url, err := h.oauthService.GetAuthURL(provider)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "生成认证 URL 失败", err)
		return
	}

	response.Success(c, gin.H{"url": url})
}
