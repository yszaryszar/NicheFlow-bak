package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
	"github.com/yszaryszar/NicheFlow/backend/internal/testutil"
	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

func setupTestHandler(t *testing.T) (*AuthHandler, *gin.Engine) {
	// 设置测试数据库
	db := testutil.SetupTestDB()
	database.SetDB(db)

	// 创建模拟服务器
	tokenServer := testutil.MockOAuthTokenServer()
	googleServer := testutil.MockGoogleUserInfoServer()
	githubServer := testutil.MockGitHubUserInfoServer()

	// 设置配置
	cfg := &config.Config{
		OAuth: config.OAuthConfig{
			BaseURL: "http://localhost:8080",
			Google: struct {
				ClientID     string   `mapstructure:"client_id"`
				ClientSecret string   `mapstructure:"client_secret"`
				RedirectURI  string   `mapstructure:"redirect_uri"`
				Scopes       []string `mapstructure:"scopes"`
				TokenURL     string   `mapstructure:"token_url"`
				UserInfoURL  string   `mapstructure:"user_info_url"`
			}{
				ClientID:     "test-google-client-id",
				ClientSecret: "test-google-client-secret",
				RedirectURI:  "http://localhost:8080/api/auth/callback/google",
				Scopes:       []string{"openid", "profile", "email"},
				TokenURL:     tokenServer.URL,
				UserInfoURL:  googleServer.URL,
			},
			GitHub: struct {
				ClientID     string   `mapstructure:"client_id"`
				ClientSecret string   `mapstructure:"client_secret"`
				RedirectURI  string   `mapstructure:"redirect_uri"`
				Scopes       []string `mapstructure:"scopes"`
				TokenURL     string   `mapstructure:"token_url"`
				UserInfoURL  string   `mapstructure:"user_info_url"`
			}{
				ClientID:     "test-github-client-id",
				ClientSecret: "test-github-client-secret",
				RedirectURI:  "http://localhost:8080/api/auth/callback/github",
				Scopes:       []string{"user", "user:email"},
				TokenURL:     tokenServer.URL,
				UserInfoURL:  githubServer.URL,
			},
		},
	}

	// 设置服务
	oauthService := service.NewOAuthService(cfg)
	authService := service.NewAuthService()

	// 设置处理器
	handler := NewAuthHandler(cfg)
	handler.oauthService = oauthService
	handler.authService = authService

	// 设置路由
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(gin.Recovery())

	// 注册清理函数
	t.Cleanup(func() {
		tokenServer.Close()
		googleServer.Close()
		githubServer.Close()
		testutil.CleanupTestDB(db)
	})

	return handler, r
}

func TestHandleProviders(t *testing.T) {
	handler, r := setupTestHandler(t)

	r.GET("/auth/providers", handler.HandleProviders)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/auth/providers", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response struct {
		Providers []ProviderResponse `json:"providers"`
	}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	assert.Len(t, response.Providers, 2)
	assert.Equal(t, "google", response.Providers[0].ID)
	assert.Equal(t, "github", response.Providers[1].ID)
}

func TestHandleCallback(t *testing.T) {
	handler, r := setupTestHandler(t)

	// 设置路由
	r.GET("/api/auth/callback/:provider", handler.HandleCallback)

	tests := []struct {
		name           string
		provider       string
		code           string
		expectedStatus int
	}{
		{
			name:           "Missing Code",
			provider:       "google",
			code:           "",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Invalid Provider",
			provider:       "invalid",
			code:           "valid-code",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Valid Google Code",
			provider:       "google",
			code:           "valid-code",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Valid GitHub Code",
			provider:       "github",
			code:           "valid-code",
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 创建请求
			w := httptest.NewRecorder()
			url := "/api/auth/callback/" + tt.provider
			if tt.code != "" {
				url += "?code=" + tt.code
			}
			req, _ := http.NewRequest("GET", url, nil)

			// 发送请求
			r.ServeHTTP(w, req)

			// 验证响应
			assert.Equal(t, tt.expectedStatus, w.Code)

			if tt.expectedStatus == http.StatusOK {
				var response map[string]interface{}
				err := json.NewDecoder(w.Body).Decode(&response)
				assert.NoError(t, err)
				assert.NotNil(t, response["session"])
				assert.NotNil(t, response["user"])
			}
		})
	}
}

func TestHandleSession(t *testing.T) {
	handler, r := setupTestHandler(t)

	r.GET("/auth/session", handler.HandleSession)

	// 创建测试用户和会话
	user := &model.User{
		Email: "test@example.com",
		Name:  "Test User",
		Role:  "user",
	}
	database.GetDB().Create(user)

	session := &model.Session{
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}
	database.GetDB().Create(session)

	tests := []struct {
		name           string
		setupContext   func(*gin.Context)
		expectedStatus int
	}{
		{
			name:           "No User",
			setupContext:   func(c *gin.Context) {},
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name: "Valid User",
			setupContext: func(c *gin.Context) {
				c.Set("user", user)
			},
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			tt.setupContext(c)
			handler.HandleSession(c)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestHandleSignOut(t *testing.T) {
	handler, r := setupTestHandler(t)

	// 设置路由
	r.POST("/api/auth/signout", handler.HandleSignOut)

	tests := []struct {
		name           string
		setupContext   func(*gin.Context)
		expectedStatus int
	}{
		{
			name: "No Session",
			setupContext: func(c *gin.Context) {
				// 不设置会话
			},
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name: "Valid Session",
			setupContext: func(c *gin.Context) {
				// 创建测试用户
				user := &model.User{
					Email: "test@example.com",
					Name:  "Test User",
					Role:  "user",
				}
				database.GetDB().Create(user)

				// 创建并保存会话到数据库
				session := &model.Session{
					ID:           "test-session-id",
					UserID:       user.ID,
					SessionToken: "test-session-token",
					ExpiresAt:    time.Now().Add(24 * time.Hour),
				}
				database.GetDB().Create(session)

				// 设置会话到上下文
				c.Set("session", session)
				c.Set("user", user)
			},
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// 创建请求
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("POST", "/api/auth/signout", nil)

			// 创建新的上下文
			c, _ := gin.CreateTestContext(w)
			c.Request = req

			// 设置上下文
			tt.setupContext(c)

			// 处理请求
			handler.HandleSignOut(c)

			// 验证响应
			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestHandleVerifyEmail(t *testing.T) {
	handler, r := setupTestHandler(t)

	r.GET("/auth/verify-email", handler.HandleVerifyEmail)

	// 创建测试验证令牌
	token := &model.VerificationToken{
		Token:     "valid-token",
		Email:     "test@example.com",
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}
	database.GetDB().Create(token)

	tests := []struct {
		name           string
		token          string
		expectedStatus int
	}{
		{
			name:           "Missing Token",
			token:          "",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Invalid Token",
			token:          "invalid-token",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Valid Token",
			token:          "valid-token",
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("GET", "/auth/verify-email?token="+tt.token, nil)
			r.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
