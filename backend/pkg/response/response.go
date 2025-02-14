// Package response 提供统一的 HTTP 响应处理功能
// 包含标准化的响应结构和各种响应类型的处理函数
// 确保 API 返回格式的一致性和规范性
package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response 响应结构
// 定义了标准的 API 响应格式，包含状态码、消息、数据和错误信息
type Response struct {
	Code    int         `json:"code"`            // HTTP 状态码
	Message string      `json:"message"`         // 响应消息
	Data    interface{} `json:"data,omitempty"`  // 响应数据，可选
	Error   string      `json:"error,omitempty"` // 错误信息，可选
}

// Success 成功响应
//
// 参数:
//   - c: Gin 上下文
//   - data: 响应数据
//
// 说明:
//
//	返回 200 状态码的成功响应
//	data 参数会被序列化到响应的 data 字段
func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    http.StatusOK,
		Message: "success",
		Data:    data,
	})
}

// Fail 失败响应
//
// 参数:
//   - c: Gin 上下文
//   - code: 错误码
//   - message: 错误消息
//
// 说明:
//
//	返回自定义错误码的失败响应
//	HTTP 状态码保持 200，但响应体中包含错误码
func Fail(c *gin.Context, code int, message string) {
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Message: message,
	})
}

// Error 错误响应
//
// 参数:
//   - c: Gin 上下文
//   - code: HTTP 状态码
//   - message: 错误消息
//   - err: 错误对象
//
// 说明:
//
//	返回带有详细错误信息的错误响应
//	如果提供了 err 参数，其错误信息会被包含在响应中
func Error(c *gin.Context, code int, message string, err error) {
	errMsg := ""
	if err != nil {
		errMsg = err.Error()
	}

	c.JSON(code, Response{
		Code:    code,
		Message: message,
		Error:   errMsg,
	})
}

// ValidationError 参数验证错误响应
//
// 参数:
//   - c: Gin 上下文
//   - message: 验证错误消息
//
// 说明:
//
//	返回 400 状态码的参数验证错误响应
//	用于请求参数验证失败的场景
func ValidationError(c *gin.Context, message string) {
	c.JSON(http.StatusBadRequest, Response{
		Code:    400,
		Message: message,
	})
}

// UnauthorizedError 未授权错误响应
//
// 参数:
//   - c: Gin 上下文
//   - message: 未授权错误消息
//
// 说明:
//
//	返回 401 状态码的未授权错误响应
//	用于用户未登录或认证失败的场景
func UnauthorizedError(c *gin.Context, message string) {
	c.JSON(http.StatusUnauthorized, Response{
		Code:    401,
		Message: message,
	})
}

// ForbiddenError 禁止访问错误响应
//
// 参数:
//   - c: Gin 上下文
//   - message: 禁止访问错误消息
//
// 说明:
//
//	返回 403 状态码的禁止访问错误响应
//	用于用户无权限访问资源的场景
func ForbiddenError(c *gin.Context, message string) {
	c.JSON(http.StatusForbidden, Response{
		Code:    403,
		Message: message,
	})
}

// NotFoundError 资源不存在错误响应
//
// 参数:
//   - c: Gin 上下文
//   - message: 资源不存在错误消息
//
// 说明:
//
//	返回 404 状态码的资源不存在错误响应
//	用于请求的资源不存在的场景
func NotFoundError(c *gin.Context, message string) {
	c.JSON(http.StatusNotFound, Response{
		Code:    404,
		Message: message,
	})
}

// ServerError 服务器错误响应
//
// 参数:
//   - c: Gin 上下文
//   - err: 错误对象
//
// 说明:
//
//	返回 500 状态码的服务器内部错误响应
//	用于服务器内部错误或未预期的异常场景
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
