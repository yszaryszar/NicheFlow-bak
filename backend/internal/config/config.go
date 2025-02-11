package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	App       AppConfig       `mapstructure:"app"`
	Database  DatabaseConfig  `mapstructure:"database"`
	Redis     RedisConfig     `mapstructure:"redis"`
	JWT       JWTConfig       `mapstructure:"jwt"`
	OpenAI    OpenAIConfig    `mapstructure:"openai"`
	Anthropic AnthropicConfig `mapstructure:"anthropic"`
	CORS      CORSConfig      `mapstructure:"cors"`
	OAuth     OAuthConfig     `mapstructure:"oauth"`
}

type AppConfig struct {
	Env     string `mapstructure:"env"`
	Name    string `mapstructure:"name"`
	Version string `mapstructure:"version"`
	Mode    string `mapstructure:"mode"`
	Port    int    `mapstructure:"port"`
}

type DatabaseConfig struct {
	Driver          string `mapstructure:"driver"`
	Host            string `mapstructure:"host"`
	Port            int    `mapstructure:"port"`
	Name            string `mapstructure:"name"`
	User            string `mapstructure:"user"`
	Password        string `mapstructure:"password"`
	SSLMode         string `mapstructure:"ssl_mode"`
	SSLTunnel       bool   `mapstructure:"ssl_tunnel"`
	MaxIdleConns    int    `mapstructure:"max_idle_conns"`
	MaxOpenConns    int    `mapstructure:"max_open_conns"`
	ConnMaxLifetime string `mapstructure:"conn_max_lifetime"`
}

type RedisConfig struct {
	Host      string `mapstructure:"host"`
	Port      int    `mapstructure:"port"`
	Password  string `mapstructure:"password"`
	DB        int    `mapstructure:"db"`
	SSLTunnel bool   `mapstructure:"ssl_tunnel"`
	TLSEnable bool   `mapstructure:"tls_enable"`
}

type JWTConfig struct {
	Secret string `mapstructure:"secret"`
	Expire string `mapstructure:"expire"`
	Issuer string `mapstructure:"issuer"`
}

type OpenAIConfig struct {
	APIKey       string  `mapstructure:"api_key"`
	Organization string  `mapstructure:"organization"`
	Model        string  `mapstructure:"model"`
	MaxTokens    int     `mapstructure:"max_tokens"`
	Temperature  float64 `mapstructure:"temperature"`
}

type AnthropicConfig struct {
	APIKey      string  `mapstructure:"api_key"`
	Model       string  `mapstructure:"model"`
	MaxTokens   int     `mapstructure:"max_tokens"`
	Temperature float64 `mapstructure:"temperature"`
}

type CORSConfig struct {
	AllowedOrigins   []string `mapstructure:"allowed_origins"`
	AllowedMethods   []string `mapstructure:"allowed_methods"`
	AllowedHeaders   []string `mapstructure:"allowed_headers"`
	AllowCredentials bool     `mapstructure:"allow_credentials"`
	MaxAge           int      `mapstructure:"max_age"`
}

type OAuthConfig struct {
	BaseURL string `mapstructure:"base_url"`
	Google  struct {
		ClientID     string   `mapstructure:"client_id"`
		ClientSecret string   `mapstructure:"client_secret"`
		RedirectURI  string   `mapstructure:"redirect_uri"`
		Scopes       []string `mapstructure:"scopes"`
		TokenURL     string   `mapstructure:"token_url"`
		UserInfoURL  string   `mapstructure:"user_info_url"`
	} `mapstructure:"google"`
	GitHub struct {
		ClientID     string   `mapstructure:"client_id"`
		ClientSecret string   `mapstructure:"client_secret"`
		RedirectURI  string   `mapstructure:"redirect_uri"`
		Scopes       []string `mapstructure:"scopes"`
		TokenURL     string   `mapstructure:"token_url"`
		UserInfoURL  string   `mapstructure:"user_info_url"`
	} `mapstructure:"github"`
}

var cfg *Config

// LoadConfig 加载配置
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
func bindEnvs(v *viper.Viper, prefix string) {
	for _, key := range v.AllKeys() {
		envKey := strings.ToUpper(strings.ReplaceAll(key, ".", "_"))
		if prefix != "" {
			envKey = prefix + "_" + envKey
		}
		_ = v.BindEnv(key, envKey)
	}
}
