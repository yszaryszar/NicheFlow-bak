package testutil

import (
	"net/http"
	"net/http/httptest"
	"strings"
)

// MockHTTPServer 创建模拟 HTTP 服务器
func MockHTTPServer(handler http.HandlerFunc) *httptest.Server {
	server := httptest.NewServer(handler)
	return server
}

// MockOAuthTokenServer 创建模拟 OAuth 令牌服务器
func MockOAuthTokenServer() *httptest.Server {
	return MockHTTPServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 验证请求方法和内容类型
		if r.Method != "POST" {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		if !strings.Contains(r.Header.Get("Content-Type"), "application/x-www-form-urlencoded") {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// 验证授权码
		if err := r.ParseForm(); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if r.Form.Get("code") != "valid-code" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"invalid_code"}`))
			return
		}

		// 检查是否是 GitHub 请求
		if strings.Contains(r.Form.Get("redirect_uri"), "github") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{
				"access_token": "mock-access-token",
				"token_type": "Bearer",
				"scope": "user,user:email",
				"id": 123456789
			}`))
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{
			"access_token": "mock-access-token",
			"token_type": "Bearer",
			"expires_in": 3600,
			"refresh_token": "mock-refresh-token",
			"scope": "openid profile email",
			"id_token": "mock-id-token",
			"sub": "123456789"
		}`))
	}))
}

// MockGoogleUserInfoServer 创建模拟 Google 用户信息服务器
func MockGoogleUserInfoServer() *httptest.Server {
	return MockHTTPServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 验证请求方法和授权头
		if r.Method != "GET" {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		auth := r.Header.Get("Authorization")
		if auth != "Bearer mock-access-token" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{
			"sub": "123456789",
			"name": "Test User",
			"given_name": "Test",
			"family_name": "User",
			"picture": "https://example.com/photo.jpg",
			"email": "test@example.com",
			"email_verified": true,
			"locale": "en"
		}`))
	}))
}

// MockGitHubUserInfoServer 创建模拟 GitHub 用户信息服务器
func MockGitHubUserInfoServer() *httptest.Server {
	return MockHTTPServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 验证请求方法和授权头
		if r.Method != "GET" {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		auth := r.Header.Get("Authorization")
		if auth != "Bearer mock-access-token" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{
			"id": 123456789,
			"login": "testuser",
			"name": "Test User",
			"email": "test@example.com",
			"avatar_url": "https://example.com/avatar.jpg"
		}`))
	}))
}
