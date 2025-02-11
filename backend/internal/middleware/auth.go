package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
)

// AuthMiddleware 认证中间件
func AuthMiddleware() gin.HandlerFunc {
	authService := service.NewAuthService()

	return func(c *gin.Context) {
		// 从请求头获取 Token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "未提供认证信息",
			})
			return
		}

		// 解析 Token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "认证格式无效",
			})
			return
		}
		sessionToken := parts[1]

		// 验证会话
		session, err := authService.ValidateSession(c.Request.Context(), sessionToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": err.Error(),
			})
			return
		}

		// 将用户信息存储到上下文
		c.Set("user", session.User)
		c.Set("session", session)

		c.Next()
	}
}

// OptionalAuth 可选认证中间件
func OptionalAuth() gin.HandlerFunc {
	authService := service.NewAuthService()

	return func(c *gin.Context) {
		// 从请求头获取 Token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		// 解析 Token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
			return
		}
		sessionToken := parts[1]

		// 验证会话
		session, err := authService.ValidateSession(c.Request.Context(), sessionToken)
		if err != nil {
			c.Next()
			return
		}

		// 将用户信息存储到上下文
		c.Set("user", session.User)
		c.Set("session", session)

		c.Next()
	}
}

// RequireRoles 角色验证中间件
func RequireRoles(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		user, exists := c.Get("user")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "未认证的用户",
			})
			return
		}

		userModel := user.(model.User)
		hasRole := false
		for _, role := range roles {
			if userModel.Role == role {
				hasRole = true
				break
			}
		}

		if !hasRole {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "权限不足",
			})
			return
		}

		c.Next()
	}
}
