package middleware

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/yszaryszar/NicheFlow/backend/internal/model"
	"github.com/yszaryszar/NicheFlow/backend/internal/testutil"
	"github.com/yszaryszar/NicheFlow/backend/pkg/database"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// 设置测试数据库
	db := testutil.SetupTestDB()
	database.SetDB(db)

	return r
}

func TestAuthMiddleware(t *testing.T) {
	r := setupTestRouter()

	// 创建测试用户和会话
	user := &model.User{
		Email: "test@example.com",
		Name:  "Test User",
		Role:  "user",
	}
	database.GetDB().Create(user)

	session := &model.Session{
		UserID:       user.ID,
		SessionToken: "valid-token",
		ExpiresAt:    time.Now().Add(24 * time.Hour),
	}
	database.GetDB().Create(session)

	r.Use(AuthMiddleware())

	r.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	tests := []struct {
		name           string
		token          string
		expectedStatus int
	}{
		{
			name:           "No Token",
			token:          "",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Invalid Token Format",
			token:          "invalid-token",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Invalid Bearer Format",
			token:          "Bearer",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Invalid Bearer Token",
			token:          "Bearer invalid-token",
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "Valid Bearer Token",
			token:          "Bearer valid-token",
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("GET", "/test", nil)
			if tt.token != "" {
				req.Header.Set("Authorization", tt.token)
			}
			r.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestOptionalAuth(t *testing.T) {
	r := setupTestRouter()

	// 创建测试用户和会话
	user := &model.User{
		Email: "test@example.com",
		Name:  "Test User",
		Role:  "user",
	}
	database.GetDB().Create(user)

	session := &model.Session{
		UserID:       user.ID,
		SessionToken: "valid-token",
		ExpiresAt:    time.Now().Add(24 * time.Hour),
	}
	database.GetDB().Create(session)

	r.Use(OptionalAuth())

	r.GET("/test", func(c *gin.Context) {
		user, exists := c.Get("user")
		c.JSON(http.StatusOK, gin.H{
			"authenticated": exists,
			"user":          user,
		})
	})

	tests := []struct {
		name              string
		token             string
		expectedStatus    int
		expectedAuthState bool
	}{
		{
			name:              "No Token",
			token:             "",
			expectedStatus:    http.StatusOK,
			expectedAuthState: false,
		},
		{
			name:              "Invalid Token",
			token:             "Bearer invalid-token",
			expectedStatus:    http.StatusOK,
			expectedAuthState: false,
		},
		{
			name:              "Valid Token",
			token:             "Bearer valid-token",
			expectedStatus:    http.StatusOK,
			expectedAuthState: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("GET", "/test", nil)
			if tt.token != "" {
				req.Header.Set("Authorization", tt.token)
			}
			r.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)

			var response struct {
				Authenticated bool        `json:"authenticated"`
				User          *model.User `json:"user"`
			}
			err := json.NewDecoder(w.Body).Decode(&response)
			assert.NoError(t, err)
			assert.Equal(t, tt.expectedAuthState, response.Authenticated)
		})
	}
}

func TestRequireRoles(t *testing.T) {
	r := setupTestRouter()

	// 创建测试用户
	user := &model.User{
		Email: "test@example.com",
		Name:  "Test User",
		Role:  "user",
	}
	database.GetDB().Create(user)

	adminUser := &model.User{
		Email: "admin@example.com",
		Name:  "Admin User",
		Role:  "admin",
	}
	database.GetDB().Create(adminUser)

	r.Use(func(c *gin.Context) {
		userType := c.Query("userType")
		if userType == "admin" {
			c.Set("user", *adminUser)
		} else {
			c.Set("user", *user)
		}
		c.Next()
	})

	r.Use(RequireRoles("admin"))

	r.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	})

	tests := []struct {
		name           string
		userType       string
		expectedStatus int
	}{
		{
			name:           "Regular User",
			userType:       "user",
			expectedStatus: http.StatusForbidden,
		},
		{
			name:           "Admin User",
			userType:       "admin",
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("GET", "/test?userType="+tt.userType, nil)
			r.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
