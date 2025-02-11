package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response 统一响应结构
type Response struct {
	Code    int         `json:"code"`            // 业务状态码
	Message string      `json:"message"`         // 响应消息
	Data    interface{} `json:"data,omitempty"`  // 响应数据
	Error   string      `json:"error,omitempty"` // 错误信息
}

// Success 成功响应
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "操作成功",
		Data:    data,
	})
}

// Fail 失败响应
func Fail(c *gin.Context, code int, message string) {
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Message: message,
	})
}

// Error 错误响应
func Error(c *gin.Context, httpCode int, message string, err error) {
	var errMsg string
	if err != nil {
		errMsg = err.Error()
	}

	c.JSON(httpCode, Response{
		Code:    httpCode,
		Message: message,
		Error:   errMsg,
	})
}

// ValidationError 参数验证错误响应
func ValidationError(c *gin.Context, message string) {
	c.JSON(http.StatusBadRequest, Response{
		Code:    400,
		Message: message,
	})
}

// UnauthorizedError 未授权错误响应
func UnauthorizedError(c *gin.Context, message string) {
	c.JSON(http.StatusUnauthorized, Response{
		Code:    401,
		Message: message,
	})
}

// ForbiddenError 禁止访问错误响应
func ForbiddenError(c *gin.Context, message string) {
	c.JSON(http.StatusForbidden, Response{
		Code:    403,
		Message: message,
	})
}

// NotFoundError 资源不存在错误响应
func NotFoundError(c *gin.Context, message string) {
	c.JSON(http.StatusNotFound, Response{
		Code:    404,
		Message: message,
	})
}

// ServerError 服务器错误响应
func ServerError(c *gin.Context, err error) {
	var errMsg string
	if err != nil {
		errMsg = err.Error()
	}

	c.JSON(http.StatusInternalServerError, Response{
		Code:    500,
		Message: "服务器内部错误",
		Error:   errMsg,
	})
}
