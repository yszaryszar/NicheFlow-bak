package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
)

// ClerkUser 定义了从 Clerk 返回的用户数据结构
type ClerkUser struct {
	ID            string    `json:"id"`
	Email         string    `json:"email"`
	Username      string    `json:"username"`
	FirstName     string    `json:"first_name"`
	LastName      string    `json:"last_name"`
	ImageURL      string    `json:"image_url"`
	EmailVerified bool      `json:"email_verified"`
	PhoneNumber   string    `json:"phone_number"`
	PhoneVerified bool      `json:"phone_verified"`
	LastSignInAt  time.Time `json:"last_sign_in_at"`
}

// AuthHandler 处理认证相关的请求
type AuthHandler struct {
	userService *service.UserService
}

// NewAuthHandler 创建一个新的认证处理器实例
func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		userService: service.NewUserService(),
	}
}

// SyncUserData 同步用户数据
// @Summary 同步 Clerk 用户数据到数据库
// @Description 将 Clerk 返回的用户数据同步到本地数据库
// @Tags auth
// @Accept json
// @Produce json
// @Param user body ClerkUser true "Clerk 用户数据"
// @Success 200 {object} model.User
// @Router /api/auth/sync [post]
func (h *AuthHandler) SyncUserData(c *gin.Context) {
	// 解析请求体中的用户数据
	var clerkUser ClerkUser
	if err := c.ShouldBindJSON(&clerkUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "无效的请求数据",
		})
		return
	}

	// 检查用户是否已存在
	user, err := h.userService.GetUserByClerkID(c.Request.Context(), clerkUser.ID)
	if err != nil {
		// 如果用户不存在，创建新用户
		user = &model.User{
			ClerkID:       clerkUser.ID,
			Email:         clerkUser.Email,
			Username:      clerkUser.Username,
			FirstName:     clerkUser.FirstName,
			LastName:      clerkUser.LastName,
			ImageURL:      clerkUser.ImageURL,
			EmailVerified: clerkUser.EmailVerified,
			PhoneNumber:   clerkUser.PhoneNumber,
			PhoneVerified: clerkUser.PhoneVerified,
			LastSignInAt:  clerkUser.LastSignInAt,
			// 设置默认值
			Role:          "user",
			Status:        "active",
			UsageLimit:    5,
			MonthlyLimit:  3,
			LastResetTime: time.Now(),
		}
		if err := h.userService.CreateUser(c.Request.Context(), user); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "创建用户失败",
			})
			return
		}
	} else {
		// 如果用户存在，更新用户信息
		user.Email = clerkUser.Email
		user.Username = clerkUser.Username
		user.FirstName = clerkUser.FirstName
		user.LastName = clerkUser.LastName
		user.ImageURL = clerkUser.ImageURL
		user.EmailVerified = clerkUser.EmailVerified
		user.PhoneNumber = clerkUser.PhoneNumber
		user.PhoneVerified = clerkUser.PhoneVerified
		user.LastSignInAt = clerkUser.LastSignInAt

		if err := h.userService.UpdateUser(c.Request.Context(), user); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "更新用户失败",
			})
			return
		}
	}

	// 返回同步后的用户数据
	c.JSON(http.StatusOK, user)
}
