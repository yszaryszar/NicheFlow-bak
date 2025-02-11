package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
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
	Session *model.Session `json:"session"`
	User    *model.User    `json:"user"`
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

	c.JSON(http.StatusOK, gin.H{"providers": providers})
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
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "未提供授权码"})
		return
	}

	// 使用授权码交换令牌
	token, err := h.oauthService.ExchangeCode(c.Request.Context(), provider, code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "获取令牌失败: " + err.Error()})
		return
	}

	// 获取用户信息
	user, err := h.oauthService.GetUserInfo(c.Request.Context(), provider, token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "获取用户信息失败: " + err.Error()})
		return
	}

	// 查找或创建用户
	existingUser, err := h.authService.GetUserByEmail(c.Request.Context(), user.Email)
	if err != nil {
		// 创建新用户
		if err := h.authService.CreateUser(c.Request.Context(), user); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "创建用户失败: " + err.Error()})
			return
		}
	} else {
		user = existingUser
	}

	// 创建或更新 OAuth 账号
	providerAccount, err := json.Marshal(token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "序列化令牌失败"})
		return
	}

	account := &model.Account{
		UserID:          user.ID,
		Type:            "oauth",
		Provider:        provider,
		ProviderID:      token["sub"].(string),
		ProviderAccount: string(providerAccount),
		AccessToken:     token["access_token"].(string),
	}

	if refreshToken, ok := token["refresh_token"]; ok {
		account.RefreshToken = refreshToken.(string)
	}

	if expiresIn, ok := token["expires_in"].(float64); ok {
		expiresAt := time.Now().Add(time.Duration(expiresIn) * time.Second)
		account.ExpiresAt = &expiresAt
	}

	if err := h.authService.CreateAccount(c.Request.Context(), account); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "保存账号信息失败"})
		return
	}

	// 创建会话
	session, err := h.authService.CreateSession(c.Request.Context(), user.ID, time.Now().Add(24*time.Hour))
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "创建会话失败"})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Session: session,
		User:    user,
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
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "未找到会话"})
		return
	}

	sessionModel := session.(*model.Session)
	if err := h.authService.DeleteSession(c.Request.Context(), sessionModel.SessionToken); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "删除会话失败"})
		return
	}

	c.JSON(http.StatusOK, MessageResponse{Message: "登出成功"})
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
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "未找到用户"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
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
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "未提供验证令牌"})
		return
	}

	if err := h.authService.VerifyEmail(c.Request.Context(), token); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "验证失败"})
		return
	}

	c.JSON(http.StatusOK, MessageResponse{Message: "邮箱验证成功"})
}
