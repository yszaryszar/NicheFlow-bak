// Package service 提供应用的业务逻辑服务层
// 包含认证、用户管理、OAuth等核心业务逻辑的实现
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
	"time"

	"github.com/yszaryszar/NicheFlow/backend/internal/config"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
)

// OAuthService OAuth 服务
// 提供第三方认证服务的集成功能
// 支持 Google、GitHub 等多个认证提供商
// 处理 OAuth 2.0 认证流程和用户信息获取
type OAuthService struct {
	cfg *config.Config // 应用配置实例
}

// NewOAuthService 创建 OAuth 服务实例
//
// 参数:
//   - cfg: 应用配置实例，包含 OAuth 相关配置
//
// 返回:
//   - *OAuthService: OAuth 服务实例
//
// 说明:
//
//	初始化 OAuth 服务，设置配置信息
//	支持多个认证提供商的配置
func NewOAuthService(cfg *config.Config) *OAuthService {
	return &OAuthService{
		cfg: cfg,
	}
}

// GetAuthURL 获取认证 URL
//
// 参数:
//   - provider: 认证提供商（如 "google"、"github"）
//
// 返回:
//   - string: 完整的认证 URL
//   - error: 生成过程中的错误，如果成功则为 nil
//
// 说明:
//
//	根据提供商生成对应的认证 URL
//	添加必要的参数（client_id、redirect_uri、scope 等）
//	支持 Google 和 GitHub 的特殊参数配置
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

	redirectURI := fmt.Sprintf("%s/api/auth/callback/%s", s.cfg.OAuth.BaseURL, provider)

	params := url.Values{}
	params.Set("response_type", "code")
	params.Set("client_id", clientID)
	params.Set("redirect_uri", redirectURI)
	params.Set("scope", strings.Join(scopes, " "))

	if provider == "google" {
		params.Set("access_type", "offline")
		params.Set("prompt", "consent")
		params.Set("include_granted_scopes", "true")
	}

	u, err := url.Parse(authURL)
	if err != nil {
		return "", fmt.Errorf("解析认证 URL 失败: %w", err)
	}
	u.RawQuery = params.Encode()

	return u.String(), nil
}

// ExchangeCode 使用授权码交换令牌
//
// 参数:
//   - ctx: 上下文
//   - provider: 认证提供商
//   - code: 授权码
//
// 返回:
//   - map[string]interface{}: 包含访问令牌等信息的映射
//   - error: 交换过程中的错误，如果成功则为 nil
//
// 说明:
//
//	使用授权码获取访问令牌
//	处理不同提供商的令牌端点
//	解析 JWT 令牌（对于 Google）
//	处理错误响应
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

	redirectURI := fmt.Sprintf("%s/api/auth/callback/%s", s.cfg.OAuth.BaseURL, provider)

	data := url.Values{}
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)
	data.Set("grant_type", "authorization_code")

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

	if provider == "google" {
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
//
// 参数:
//   - ctx: 上下文
//   - provider: 认证提供商
//   - token: 包含访问令牌的映射
//
// 返回:
//   - *model.User: 用户信息
//   - error: 获取过程中的错误，如果成功则为 nil
//
// 说明:
//
//	使用访问令牌获取用户信息
//	处理不同提供商的用户信息格式
//	统一用户信息字段
//	设置默认的用户属性
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

	var email, username, firstName, lastName, imageURL string
	switch provider {
	case "google":
		email = userInfo["email"].(string)
		name := userInfo["name"].(string)
		names := strings.Split(name, " ")
		if len(names) > 0 {
			firstName = names[0]
			if len(names) > 1 {
				lastName = strings.Join(names[1:], " ")
			}
		}
		username = strings.Split(email, "@")[0]
		imageURL = userInfo["picture"].(string)
	case "github":
		email = userInfo["email"].(string)
		username = userInfo["login"].(string)
		name := userInfo["name"].(string)
		if name != "" {
			names := strings.Split(name, " ")
			if len(names) > 0 {
				firstName = names[0]
				if len(names) > 1 {
					lastName = strings.Join(names[1:], " ")
				}
			}
		}
		imageURL = userInfo["avatar_url"].(string)
	}

	user := &model.User{
		Email:         email,
		Username:      username,
		FirstName:     firstName,
		LastName:      lastName,
		ImageURL:      imageURL,
		EmailVerified: true,
		LastSignInAt:  time.Now(),
		Role:          "user",
		Status:        "active",
		Language:      "zh",
		Theme:         "light",
	}

	return user, nil
}
