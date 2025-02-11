package service

import (
	"context"
	"encoding/base64"
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
	var scopes []string

	switch provider {
	case "google":
		authURL = "https://accounts.google.com/o/oauth2/v2/auth"
		clientID = s.cfg.OAuth.Google.ClientID
		scopes = s.cfg.OAuth.Google.Scopes
	case "github":
		authURL = "https://github.com/login/oauth/authorize"
		clientID = s.cfg.OAuth.GitHub.ClientID
		scopes = s.cfg.OAuth.GitHub.Scopes
	default:
		return "", fmt.Errorf("不支持的认证提供商: %s", provider)
	}

	// 构建重定向 URL
	redirectURI := fmt.Sprintf("%s/api/auth/callback/%s", s.cfg.OAuth.BaseURL, provider)

	// 构建参数，确保参数顺序符合 OAuth 2.0 规范
	params := url.Values{}
	params.Set("response_type", "code") // 将 response_type 放在最前面
	params.Set("client_id", clientID)
	params.Set("redirect_uri", redirectURI)
	params.Set("scope", strings.Join(scopes, " "))

	if provider == "google" {
		params.Set("access_type", "offline")
		params.Set("prompt", "consent")
		params.Set("include_granted_scopes", "true") // 添加此参数以包含已授权的权限
	}

	// 使用 url.URL 来构建完整的 URL
	u, err := url.Parse(authURL)
	if err != nil {
		return "", fmt.Errorf("解析认证 URL 失败: %w", err)
	}
	u.RawQuery = params.Encode()

	return u.String(), nil
}

// ExchangeCode 使用授权码交换令牌
func (s *OAuthService) ExchangeCode(ctx context.Context, provider string, code string) (map[string]interface{}, error) {
	var tokenURL string
	var clientID, clientSecret string

	switch provider {
	case "google":
		tokenURL = "https://oauth2.googleapis.com/token"
		clientID = s.cfg.OAuth.Google.ClientID
		clientSecret = s.cfg.OAuth.Google.ClientSecret
	case "github":
		tokenURL = "https://github.com/login/oauth/access_token"
		clientID = s.cfg.OAuth.GitHub.ClientID
		clientSecret = s.cfg.OAuth.GitHub.ClientSecret
	default:
		return nil, fmt.Errorf("不支持的认证提供商: %s", provider)
	}

	// 构建重定向 URL
	redirectURI := fmt.Sprintf("%s/api/auth/callback/%s", s.cfg.OAuth.BaseURL, provider)

	// 准备请求数据
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

	// 添加 sub 字段
	if provider == "google" {
		// 解析 ID 令牌获取 sub
		idToken, ok := result["id_token"].(string)
		if ok {
			parts := strings.Split(idToken, ".")
			if len(parts) == 3 {
				payload, err := base64.RawURLEncoding.DecodeString(parts[1])
				if err == nil {
					var claims map[string]interface{}
					if err := json.Unmarshal(payload, &claims); err == nil {
						if sub, ok := claims["sub"].(string); ok {
							result["sub"] = sub
						}
					}
				}
			}
		}
	}

	return result, nil
}

// GetUserInfo 获取用户信息
func (s *OAuthService) GetUserInfo(ctx context.Context, provider string, token map[string]interface{}) (*model.User, error) {
	var userInfoURL string
	accessToken, ok := token["access_token"].(string)
	if !ok {
		return nil, fmt.Errorf("无效的访问令牌")
	}

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

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("获取用户信息失败: %s", resp.Status)
	}

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
