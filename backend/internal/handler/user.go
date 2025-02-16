// Package handler 提供 HTTP 请求处理器
package handler

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/service"
	"github.com/yszaryszar/NicheFlow/backend/pkg/response"
)

// UserHandler 处理用户相关的 HTTP 请求
type UserHandler struct {
	userService *service.UserService
}

// NewUserHandler 创建一个新的用户处理器实例
func NewUserHandler() *UserHandler {
	return &UserHandler{
		userService: service.NewUserService(),
	}
}

// GetProfile godoc
// @Summary 获取用户个人资料
// @Description 获取当前登录用户的详细信息，包括基本信息、社交账号和偏好设置
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Success 200 {object} response.Response{data=model.User}
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /v1/user/profile [get]
func (h *UserHandler) GetProfile(c *gin.Context) {
	clerkID := c.GetString("clerk_user_id")
	if clerkID == "" {
		response.UnauthorizedError(c, "未授权访问")
		return
	}

	user, err := h.userService.GetUserByClerkID(c.Request.Context(), clerkID)
	if err != nil {
		response.ServerError(c, err)
		return
	}

	response.Success(c, user)
}

// UpdateProfile godoc
// @Summary 更新用户个人资料
// @Description 更新当前登录用户的基本信息
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Param user body model.User true "用户信息"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /v1/user/profile [put]
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	clerkID := c.GetString("clerk_user_id")
	if clerkID == "" {
		response.UnauthorizedError(c, "未授权访问")
		return
	}

	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		response.ValidationError(c, "无效的请求数据")
		return
	}

	// 确保不能修改关键字段
	user.ClerkID = clerkID
	if err := h.userService.UpdateUser(c.Request.Context(), &user); err != nil {
		response.ServerError(c, err)
		return
	}

	response.Success(c, nil)
}

// UpdatePreferences godoc
// @Summary 更新用户偏好设置
// @Description 更新用户的偏好设置，包括语言、主题等
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Param preferences body map[string]interface{} true "偏好设置"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /v1/user/preferences [put]
func (h *UserHandler) UpdatePreferences(c *gin.Context) {
	clerkID := c.GetString("clerk_user_id")
	if clerkID == "" {
		response.UnauthorizedError(c, "未授权访问")
		return
	}

	var preferences map[string]interface{}
	if err := c.ShouldBindJSON(&preferences); err != nil {
		response.ValidationError(c, "无效的请求数据")
		return
	}

	if err := h.userService.UpdateUserPreferences(c.Request.Context(), clerkID, preferences); err != nil {
		response.ServerError(c, err)
		return
	}

	response.Success(c, nil)
}

// GetPreferences godoc
// @Summary 获取用户偏好设置
// @Description 获取用户的所有偏好设置
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Success 200 {object} response.Response{data=map[string]interface{}}
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /v1/user/preferences [get]
func (h *UserHandler) GetPreferences(c *gin.Context) {
	clerkID := c.GetString("clerk_user_id")
	if clerkID == "" {
		response.UnauthorizedError(c, "未授权访问")
		return
	}

	preferences, err := h.userService.GetUserPreference(c.Request.Context(), clerkID)
	if err != nil {
		response.ServerError(c, err)
		return
	}

	response.Success(c, preferences)
}

// LinkSocialAccount godoc
// @Summary 绑定社交账号
// @Description 为当前用户绑定新的社交账号
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Param account body model.SocialAccount true "社交账号信息"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /v1/user/social-accounts [post]
func (h *UserHandler) LinkSocialAccount(c *gin.Context) {
	clerkID := c.GetString("clerk_user_id")
	if clerkID == "" {
		response.UnauthorizedError(c, "未授权访问")
		return
	}

	var account model.SocialAccount
	if err := c.ShouldBindJSON(&account); err != nil {
		response.ValidationError(c, "无效的请求数据")
		return
	}

	if err := h.userService.LinkSocialAccount(c.Request.Context(), clerkID, &account); err != nil {
		response.ServerError(c, err)
		return
	}

	response.Success(c, nil)
}

// UnlinkSocialAccount godoc
// @Summary 解绑社交账号
// @Description 解除当前用户的社交账号绑定
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Param provider path string true "社交平台提供商"
// @Param accountId path string true "社交账号ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /v1/user/social-accounts/{provider}/{accountId} [delete]
func (h *UserHandler) UnlinkSocialAccount(c *gin.Context) {
	clerkID := c.GetString("clerk_user_id")
	if clerkID == "" {
		response.UnauthorizedError(c, "未授权访问")
		return
	}

	provider := c.Param("provider")
	accountID := c.Param("accountId")
	if provider == "" || accountID == "" {
		response.ValidationError(c, "无效的请求参数")
		return
	}

	if err := h.userService.UnlinkSocialAccount(c.Request.Context(), clerkID, provider, accountID); err != nil {
		response.ServerError(c, err)
		return
	}

	response.Success(c, nil)
}

// GetSocialAccounts godoc
// @Summary 获取社交账号列表
// @Description 获取当前用户绑定的所有社交账号
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Success 200 {object} response.Response{data=[]model.SocialAccount}
// @Failure 401 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /v1/user/social-accounts [get]
func (h *UserHandler) GetSocialAccounts(c *gin.Context) {
	clerkID := c.GetString("clerk_user_id")
	if clerkID == "" {
		response.UnauthorizedError(c, "未授权访问")
		return
	}

	accounts, err := h.userService.GetUserSocialAccounts(c.Request.Context(), clerkID)
	if err != nil {
		response.ServerError(c, err)
		return
	}

	response.Success(c, accounts)
}

// GetUsage godoc
// @Summary 获取用户使用统计
// @Description 获取当前用户的 API 使用统计信息
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Success 200 {object} Response{data=model.UsageStats} "使用统计信息"
// @Failure 401 {object} Response "未授权"
// @Failure 500 {object} Response "服务器错误"
// @Router /api/user/usage [get]
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

// GetSubscription godoc
// @Summary 获取用户订阅信息
// @Description 获取当前用户的订阅计划和状态信息
// @Tags 用户
// @Accept json
// @Produce json
// @Security ClerkAuth
// @Success 200 {object} Response{data=model.SubscriptionInfo} "订阅信息"
// @Failure 401 {object} Response "未授权"
// @Failure 500 {object} Response "服务器错误"
// @Router /api/user/subscription [get]
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

// WebhookHandler godoc
// @Summary 处理 Clerk Webhook
// @Description 处理来自 Clerk 的 Webhook 事件
// @Tags Webhook
// @Accept json
// @Produce json
// @Param event body interface{} true "Webhook 事件数据"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Router /v1/webhook/clerk [post]
func (h *UserHandler) WebhookHandler(c *gin.Context) {
	var event map[string]interface{}
	if err := json.NewDecoder(c.Request.Body).Decode(&event); err != nil {
		response.ValidationError(c, "无效的 Webhook 数据")
		return
	}

	// TODO: 验证 Webhook 签名

	// 处理不同类型的事件
	eventType, ok := event["type"].(string)
	if !ok {
		response.ValidationError(c, "无效的事件类型")
		return
	}

	switch eventType {
	case "user.created":
		// 处理用户创建事件
		// TODO: 实现用户创建逻辑
	case "user.updated":
		// 处理用户更新事件
		// TODO: 实现用户更新逻辑
	case "user.deleted":
		// 处理用户删除事件
		// TODO: 实现用户删除逻辑
	}

	response.Success(c, nil)
}
