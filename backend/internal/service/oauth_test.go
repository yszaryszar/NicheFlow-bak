package service

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/testutil"
)

func setupTestConfig(tokenURL, googleInfoURL, githubInfoURL string) *config.Config {
	return &config.Config{
		OAuth: config.OAuthConfig{
			BaseURL: "http://localhost:8080",
			Google: config.OAuthProviderConfig{
				ClientID:     "test-google-client-id",
				ClientSecret: "test-google-client-secret",
				RedirectURI:  "http://localhost:8080/api/auth/callback/google",
				Scopes:       []string{"openid", "profile", "email"},
				TokenURL:     tokenURL,
				UserInfoURL:  googleInfoURL,
			},
			GitHub: config.OAuthProviderConfig{
				ClientID:     "test-github-client-id",
				ClientSecret: "test-github-client-secret",
				RedirectURI:  "http://localhost:8080/api/auth/callback/github",
				Scopes:       []string{"user", "user:email"},
				TokenURL:     tokenURL,
				UserInfoURL:  githubInfoURL,
			},
		},
	}
}

func TestGetAuthURL(t *testing.T) {
	cfg := setupTestConfig("", "", "")
	service := NewOAuthService(cfg)

	tests := []struct {
		name           string
		provider       string
		expectedError  bool
		expectedURLKey string
	}{
		{
			name:           "Google Auth URL",
			provider:       "google",
			expectedError:  false,
			expectedURLKey: "client_id=test-google-client-id",
		},
		{
			name:           "GitHub Auth URL",
			provider:       "github",
			expectedError:  false,
			expectedURLKey: "client_id=test-github-client-id",
		},
		{
			name:          "Invalid Provider",
			provider:      "invalid",
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			url, err := service.GetAuthURL(tt.provider)
			if tt.expectedError {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Contains(t, url, tt.expectedURLKey)
		})
	}
}

func TestExchangeCode(t *testing.T) {
	// 创建模拟服务器
	tokenServer := testutil.MockOAuthTokenServer()
	defer tokenServer.Close()

	// 设置配置
	cfg := setupTestConfig(tokenServer.URL, "", "")
	service := NewOAuthService(cfg)

	tests := []struct {
		name          string
		provider      string
		code          string
		expectedError bool
	}{
		{
			name:          "Valid Exchange",
			provider:      "google",
			code:          "valid-code",
			expectedError: false,
		},
		{
			name:          "Invalid Code",
			provider:      "google",
			code:          "invalid-code",
			expectedError: true,
		},
		{
			name:          "Invalid Provider",
			provider:      "invalid",
			code:          "valid-code",
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			token, err := service.ExchangeCode(context.Background(), tt.provider, tt.code)
			if tt.expectedError {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.NotNil(t, token)
			assert.Equal(t, "mock-access-token", token["access_token"])
		})
	}
}

func TestGetUserInfo(t *testing.T) {
	// 创建模拟服务器
	googleServer := testutil.MockGoogleUserInfoServer()
	defer googleServer.Close()

	githubServer := testutil.MockGitHubUserInfoServer()
	defer githubServer.Close()

	// 设置配置
	cfg := setupTestConfig("", googleServer.URL, githubServer.URL)
	service := NewOAuthService(cfg)

	tests := []struct {
		name          string
		provider      string
		token         map[string]interface{}
		expectedError bool
	}{
		{
			name:     "Google User Info",
			provider: "google",
			token: map[string]interface{}{
				"access_token": "mock-access-token",
				"token_type":   "Bearer",
			},
			expectedError: false,
		},
		{
			name:     "GitHub User Info",
			provider: "github",
			token: map[string]interface{}{
				"access_token": "mock-access-token",
				"token_type":   "Bearer",
			},
			expectedError: false,
		},
		{
			name:     "Invalid Token",
			provider: "google",
			token: map[string]interface{}{
				"access_token": "invalid-token",
				"token_type":   "Bearer",
			},
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			user, err := service.GetUserInfo(context.Background(), tt.provider, tt.token)
			if tt.expectedError {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.NotNil(t, user)
			assert.NotEmpty(t, user.Email)
			assert.NotEmpty(t, user.Name)
			assert.NotEmpty(t, user.Image)
		})
	}
}
