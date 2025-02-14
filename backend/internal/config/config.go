// Package config 提供应用配置管理功能
// 负责加载、解析和管理应用的所有配置项，支持从配置文件和环境变量加载配置
package config

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

// Config 应用配置结构
// 包含应用运行所需的所有配置信息
type Config struct {
	App        AppConfig        `mapstructure:"app"`        // 基础应用配置
	Database   DatabaseConfig   `mapstructure:"database"`   // 数据库配置
	Redis      RedisConfig      `mapstructure:"redis"`      // Redis 配置
	Clerk      ClerkConfig      `mapstructure:"clerk"`      // Clerk 认证配置
	Middleware MiddlewareConfig `mapstructure:"middleware"` // 中间件配置
	OpenAI     OpenAIConfig     `mapstructure:"openai"`     // OpenAI 配置
	Anthropic  AnthropicConfig  `mapstructure:"anthropic"`  // Anthropic 配置
	CORS       CORSConfig       `mapstructure:"cors"`       // CORS 配置
}

// AppConfig 应用基础配置
type AppConfig struct {
	Env     string `mapstructure:"env"`      // 运行环境（development/production）
	Name    string `mapstructure:"name"`     // 应用名称
	Version string `mapstructure:"version"`  // 应用版本
	Mode    string `mapstructure:"mode"`     // 运行模式（debug/release）
	Port    int    `mapstructure:"port"`     // 服务端口
	BaseURL string `mapstructure:"base_url"` // 基础 URL
	Region  string `mapstructure:"region"`   // 运行区域（hk/us）
}

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	Driver          string `mapstructure:"driver"`            // 数据库驱动
	Host            string `mapstructure:"host"`              // 数据库主机
	Port            int    `mapstructure:"port"`              // 数据库端口
	Name            string `mapstructure:"name"`              // 数据库名称
	User            string `mapstructure:"user"`              // 数据库用户
	Password        string `mapstructure:"password"`          // 数据库密码
	SSLMode         string `mapstructure:"ssl_mode"`          // SSL 模式
	SSLTunnel       bool   `mapstructure:"ssl_tunnel"`        // 是否使用 SSL 隧道
	MaxIdleConns    int    `mapstructure:"max_idle_conns"`    // 最大空闲连接数
	MaxOpenConns    int    `mapstructure:"max_open_conns"`    // 最大打开连接数
	ConnMaxLifetime string `mapstructure:"conn_max_lifetime"` // 连接最大生命周期
}

// RedisConfig Redis 配置
type RedisConfig struct {
	Host        string `mapstructure:"host"`          // Redis 主机
	Port        int    `mapstructure:"port"`          // Redis 端口
	Password    string `mapstructure:"password"`      // Redis 密码
	DB          int    `mapstructure:"db"`            // Redis 数据库编号
	SSLTunnel   bool   `mapstructure:"ssl_tunnel"`    // 是否使用 SSL 隧道
	TLSEnable   bool   `mapstructure:"tls_enable"`    // 是否启用 TLS
	TLSCertFile string `mapstructure:"tls_cert_file"` // TLS 证书文件
	TLSKeyFile  string `mapstructure:"tls_key_file"`  // TLS 密钥文件
	TLSCAFile   string `mapstructure:"tls_ca_file"`   // TLS CA 证书文件
}

// ClerkConfig Clerk 认证配置
type ClerkConfig struct {
	APIKey      string `mapstructure:"api_key"`      // Clerk API 密钥
	FrontendAPI string `mapstructure:"frontend_api"` // Clerk 前端 API 密钥
	WebhookKey  string `mapstructure:"webhook_key"`  // Webhook 密钥
}

// MiddlewareConfig 中间件配置
type MiddlewareConfig struct {
	RateLimit RateLimitConfig `mapstructure:"rate_limit"` // 速率限制配置
	CORS      CORSConfig      `mapstructure:"cors"`       // CORS 配置
}

// RateLimitConfig 速率限制配置
type RateLimitConfig struct {
	Enabled  bool          `mapstructure:"enabled"`  // 是否启用速率限制
	Limit    int           `mapstructure:"limit"`    // 限制次数
	Duration time.Duration `mapstructure:"duration"` // 限制时间窗口
}

// CORSConfig CORS 配置
type CORSConfig struct {
	AllowOrigins     []string `mapstructure:"allow_origins"`     // 允许的源
	AllowMethods     []string `mapstructure:"allow_methods"`     // 允许的方法
	AllowHeaders     []string `mapstructure:"allow_headers"`     // 允许的头部
	ExposeHeaders    []string `mapstructure:"expose_headers"`    // 暴露的头部
	AllowCredentials bool     `mapstructure:"allow_credentials"` // 是否允许凭证
	MaxAge           int      `mapstructure:"max_age"`           // 预检请求缓存时间
}

// OpenAIConfig OpenAI 配置
type OpenAIConfig struct {
	APIKey       string  `mapstructure:"api_key"`      // OpenAI API 密钥
	Organization string  `mapstructure:"organization"` // OpenAI 组织 ID
	Model        string  `mapstructure:"model"`        // 使用的模型
	MaxTokens    int     `mapstructure:"max_tokens"`   // 最大 token 数
	Temperature  float64 `mapstructure:"temperature"`  // 温度参数
}

// AnthropicConfig Anthropic 配置
type AnthropicConfig struct {
	APIKey      string  `mapstructure:"api_key"`     // Anthropic API 密钥
	Model       string  `mapstructure:"model"`       // 使用的模型
	MaxTokens   int     `mapstructure:"max_tokens"`  // 最大 token 数
	Temperature float64 `mapstructure:"temperature"` // 温度参数
}

var cfg *Config

// LoadConfig 加载应用配置
//
// 返回:
//   - *Config: 配置对象
//   - error: 错误信息
//
// 说明:
//
//	该函数完成以下操作：
//	1. 加载环境变量文件
//	2. 设置配置文件路径和类型
//	3. 启用环境变量替换
//	4. 读取并解析配置
//	5. 替换配置中的环境变量
func LoadConfig() (*Config, error) {
	if cfg != nil {
		return cfg, nil
	}

	// 加载 .env 文件
	if err := loadEnv(); err != nil {
		return nil, fmt.Errorf("加载 .env 文件失败: %w", err)
	}

	// 设置配置文件
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("configs")

	// 启用环境变量替换
	viper.AutomaticEnv()
	viper.SetEnvPrefix("")
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AllowEmptyEnv(true)

	// 读取配置文件
	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("读取配置文件失败: %w", err)
	}

	// 替换配置文件中的环境变量
	for _, key := range viper.AllKeys() {
		val := viper.GetString(key)
		if strings.HasPrefix(val, "${") && strings.HasSuffix(val, "}") {
			envKey := strings.TrimSuffix(strings.TrimPrefix(val, "${"), "}")
			if envVal := os.Getenv(envKey); envVal != "" {
				viper.Set(key, envVal)
			}
		}
	}

	// 解析配置到结构体
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("解析配置文件失败: %w", err)
	}

	return cfg, nil
}

// loadEnv 加载环境变量文件
//
// 返回:
//   - error: 错误信息
//
// 说明:
//
//	该函数加载环境特定的 .env 文件和默认的 .env 文件
func loadEnv() error {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	// 加载环境特定的 .env 文件
	envFile := fmt.Sprintf(".env.%s", env)
	if _, err := os.Stat(envFile); err == nil {
		if err := godotenv.Load(envFile); err != nil {
			return fmt.Errorf("加载 %s 失败: %w", envFile, err)
		}
	}

	// 加载默认的 .env 文件（如果存在）
	if _, err := os.Stat(".env"); err == nil {
		if err := godotenv.Load(); err != nil {
			return fmt.Errorf("加载 .env 失败: %w", err)
		}
	}

	return nil
}

// bindEnvs 递归绑定环境变量
//
// 参数:
//   - v: Viper 实例
//   - prefix: 环境变量前缀
//
// 说明:
//
//	该函数将配置键绑定到对应的环境变量
func bindEnvs(v *viper.Viper, prefix string) {
	for _, key := range v.AllKeys() {
		envKey := strings.ToUpper(strings.ReplaceAll(key, ".", "_"))
		if prefix != "" {
			envKey = prefix + "_" + envKey
		}
		_ = v.BindEnv(key, envKey)
	}
}

// GetDSN 获取数据库连接字符串
//
// 返回:
//   - string: 数据库连接字符串
//
// 说明:
//
//	该方法根据配置生成 PostgreSQL 数据库连接字符串
func (c *DatabaseConfig) GetDSN() string {
	sslMode := "disable"
	if c.SSLMode != "" {
		sslMode = c.SSLMode
	}

	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.Name, sslMode)
}

// GetRedisAddr 获取 Redis 连接地址
//
// 返回:
//   - string: Redis 连接地址
//
// 说明:
//
//	该方法根据配置生成 Redis 连接地址
func (c *RedisConfig) GetRedisAddr() string {
	return fmt.Sprintf("%s:%d", c.Host, c.Port)
}
