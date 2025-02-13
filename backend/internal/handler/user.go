package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
	"github.com/yszaryszar/NicheFlow/backend/pkg/response"
)

// UserHandler 用户处理器
type UserHandler struct {
	userService *service.UserService
}

// NewUserHandler 创建用户处理器实例
func NewUserHandler() *UserHandler {
	return &UserHandler{
		userService: service.NewUserService(),
	}
}

// GetProfile 获取用户资料
func (h *UserHandler) GetProfile(c *gin.Context) {
	clerkID := c.GetHeader("X-Clerk-User-Id")
	if clerkID == "" {
		response.Error(c, http.StatusUnauthorized, "未认证", nil)
		return
	}

	user, err := h.userService.GetUserByClerkID(c.Request.Context(), clerkID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取用户信息失败", err)
		return
	}

	if user == nil {
		response.Error(c, http.StatusNotFound, "用户不存在", nil)
		return
	}

	response.Success(c, user)
}

// UpdateProfile 更新用户资料
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	clerkID := c.GetHeader("X-Clerk-User-Id")
	if clerkID == "" {
		response.Error(c, http.StatusUnauthorized, "未认证", nil)
		return
	}

	var updateData struct {
		Language string `json:"language"`
		Theme    string `json:"theme"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		response.Error(c, http.StatusBadRequest, "无效的请求数据", err)
		return
	}

	if err := h.userService.UpdateUserPreferences(c.Request.Context(), clerkID, updateData.Language, updateData.Theme); err != nil {
		response.Error(c, http.StatusInternalServerError, "更新用户偏好设置失败", err)
		return
	}

	response.Success(c, gin.H{"message": "更新成功"})
}

// GetUsage 获取使用统计
func (h *UserHandler) GetUsage(c *gin.Context) {
	clerkID := c.GetHeader("X-Clerk-User-Id")
	if clerkID == "" {
		response.Error(c, http.StatusUnauthorized, "未认证", nil)
		return
	}

	usage, err := h.userService.GetUserUsage(c.Request.Context(), clerkID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取使用统计失败", err)
		return
	}

	response.Success(c, usage)
}

// GetSubscription 获取订阅信息
func (h *UserHandler) GetSubscription(c *gin.Context) {
	clerkID := c.GetHeader("X-Clerk-User-Id")
	if clerkID == "" {
		response.Error(c, http.StatusUnauthorized, "未认证", nil)
		return
	}

	subscription, err := h.userService.GetUserSubscription(c.Request.Context(), clerkID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取订阅信息失败", err)
		return
	}

	response.Success(c, subscription)
}

// WebhookHandler 处理 Clerk Webhook
func (h *UserHandler) WebhookHandler(c *gin.Context) {
	var event struct {
		Type string `json:"type"`
		Data struct {
			ID        string `json:"id"`
			FirstName string `json:"first_name"`
			LastName  string `json:"last_name"`
			Username  string `json:"username"`
			ImageURL  string `json:"image_url"`
			Email     string `json:"email_address"`
			Phone     string `json:"phone_number"`
		} `json:"data"`
	}

	if err := c.ShouldBindJSON(&event); err != nil {
		response.Error(c, http.StatusBadRequest, "无效的 webhook 数据", err)
		return
	}

	switch event.Type {
	case "user.created":
		// 创建新用户
		user := &model.User{
			ClerkID:     event.Data.ID,
			Username:    event.Data.Username,
			FirstName:   event.Data.FirstName,
			LastName:    event.Data.LastName,
			ImageURL:    event.Data.ImageURL,
			Email:       event.Data.Email,
			PhoneNumber: event.Data.Phone,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}

		if err := h.userService.CreateUser(c.Request.Context(), user); err != nil {
			response.Error(c, http.StatusInternalServerError, "创建用户失败", err)
			return
		}

	case "user.updated":
		// 更新用户信息
		user := &model.User{
			ClerkID:     event.Data.ID,
			Username:    event.Data.Username,
			FirstName:   event.Data.FirstName,
			LastName:    event.Data.LastName,
			ImageURL:    event.Data.ImageURL,
			Email:       event.Data.Email,
			PhoneNumber: event.Data.Phone,
			UpdatedAt:   time.Now(),
		}

		if err := h.userService.UpdateUser(c.Request.Context(), user); err != nil {
			response.Error(c, http.StatusInternalServerError, "更新用户失败", err)
			return
		}
	}

	response.Success(c, gin.H{"message": "webhook 处理成功"})
}
