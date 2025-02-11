package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
)

// OAuthService OAuth 服务
type OAuthService struct {
	cfg *config.Config
}

// NewOAuthService 创建 OAuth 服务实例
func NewOAuthService(cfg *config.Config) *OAuthService {
	return &OAuthService{
		cfg: cfg,
	}
}

// GetAuthURL 获取认证 URL
func (s *OAuthService) GetAuthURL(provider string) (string, error) {
	var authURL string
	var clientID string
	var redirectURI string
	var scopes []string

	switch provider {
	case "google":
		authURL = "https://accounts.google.com/o/oauth2/v2/auth"
		clientID = s.cfg.OAuth.Google.ClientID
		redirectURI = s.cfg.OAuth.Google.RedirectURI
		scopes = s.cfg.OAuth.Google.Scopes
	case "github":
		authURL = "https://github.com/login/oauth/authorize"
		clientID = s.cfg.OAuth.GitHub.ClientID
		redirectURI = s.cfg.OAuth.GitHub.RedirectURI
		scopes = s.cfg.OAuth.GitHub.Scopes
	default:
		return "", fmt.Errorf("不支持的认证提供商: %s", provider)
	}

	params := url.Values{}
	params.Add("client_id", clientID)
	params.Add("redirect_uri", redirectURI)
	params.Add("scope", strings.Join(scopes, " "))
	params.Add("response_type", "code")

	if provider == "google" {
		params.Add("access_type", "offline")
		params.Add("prompt", "consent")
	}

	return fmt.Sprintf("%s?%s", authURL, params.Encode()), nil
}

// ExchangeCode 使用授权码交换令牌
func (s *OAuthService) ExchangeCode(ctx context.Context, provider, code string) (map[string]interface{}, error) {
	var tokenURL string
	var clientID string
	var clientSecret string
	var redirectURI string

	switch provider {
	case "google":
		tokenURL = "https://oauth2.googleapis.com/token"
		clientID = s.cfg.OAuth.Google.ClientID
		clientSecret = s.cfg.OAuth.Google.ClientSecret
		redirectURI = s.cfg.OAuth.Google.RedirectURI
	case "github":
		tokenURL = "https://github.com/login/oauth/access_token"
		clientID = s.cfg.OAuth.GitHub.ClientID
		clientSecret = s.cfg.OAuth.GitHub.ClientSecret
		redirectURI = s.cfg.OAuth.GitHub.RedirectURI
	default:
		return nil, fmt.Errorf("不支持的认证提供商: %s", provider)
	}

	// 准备请求参数
	data := url.Values{}
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)
	data.Set("grant_type", "authorization_code")

	// 发送请求
	req, err := http.NewRequestWithContext(ctx, "POST", tokenURL, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	if provider == "github" {
		req.Header.Set("Accept", "application/json")
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求失败: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %w", err)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("解析响应失败: %w", err)
	}

	if result["error"] != nil {
		return nil, fmt.Errorf("获取令牌失败: %v", result["error"])
	}

	return result, nil
}

// GetUserInfo 获取用户信息
func (s *OAuthService) GetUserInfo(ctx context.Context, provider string, token map[string]interface{}) (*model.User, error) {
	var userInfoURL string
	accessToken := token["access_token"].(string)

	switch provider {
	case "google":
		userInfoURL = "https://www.googleapis.com/oauth2/v3/userinfo"
	case "github":
		userInfoURL = "https://api.github.com/user"
	default:
		return nil, fmt.Errorf("不支持的认证提供商: %s", provider)
	}

	// 发送请求
	req, err := http.NewRequestWithContext(ctx, "GET", userInfoURL, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %w", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	if provider == "github" {
		req.Header.Set("Accept", "application/json")
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求失败: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %w", err)
	}

	var userInfo map[string]interface{}
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, fmt.Errorf("解析响应失败: %w", err)
	}

	// 提取用户信息
	var email, name, image string
	switch provider {
	case "google":
		email = userInfo["email"].(string)
		name = userInfo["name"].(string)
		image = userInfo["picture"].(string)
	case "github":
		email = userInfo["email"].(string)
		name = userInfo["name"].(string)
		if name == "" {
			name = userInfo["login"].(string)
		}
		image = userInfo["avatar_url"].(string)
	}

	// 创建用户模型
	user := &model.User{
		Email:    email,
		Name:     name,
		Image:    image,
		Provider: provider,
		Role:     "user",
		Status:   "active",
	}

	return user, nil
}
