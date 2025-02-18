package config

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ssm"
)

// LoadFromSSM 从 AWS SSM Parameter Store 加载配置
func LoadFromSSM(ctx context.Context) (*Config, error) {
	// 获取 AWS 区域
	region := os.Getenv("AWS_REGION")
	if region == "" {
		region = "ap-east-1" // 默认使用香港区域
	}

	// 获取环境
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development" // 默认使用开发环境
	}

	// 获取区域代码
	regionCode := getRegionCode(region)

	// 构建参数路径
	paramPath := fmt.Sprintf("/nicheflow/%s/%s", env, regionCode)

	// 创建 AWS 会话
	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion(region),
	)
	if err != nil {
		return nil, fmt.Errorf("无法加载 AWS 配置: %v", err)
	}

	// 创建 SSM 客户端
	client := ssm.NewFromConfig(cfg)

	// 获取所有参数
	params, err := getAllParameters(ctx, client, paramPath)
	if err != nil {
		return nil, fmt.Errorf("获取参数失败: %v", err)
	}

	// 转换为配置结构
	return paramsToConfig(params), nil
}

// getAllParameters 获取指定路径下的所有参数
func getAllParameters(ctx context.Context, client *ssm.Client, paramPath string) (map[string]string, error) {
	params := make(map[string]string)
	var nextToken *string

	for {
		input := &ssm.GetParametersByPathInput{
			Path:           &paramPath,
			Recursive:      aws.Bool(true),
			WithDecryption: aws.Bool(true),
			NextToken:      nextToken,
		}

		output, err := client.GetParametersByPath(ctx, input)
		if err != nil {
			return nil, err
		}

		for _, param := range output.Parameters {
			// 移除基础路径，只保留相对路径
			name := strings.TrimPrefix(*param.Name, paramPath+"/")
			params[name] = *param.Value
		}

		if output.NextToken == nil {
			break
		}
		nextToken = output.NextToken
	}

	return params, nil
}

// paramsToConfig 将参数映射转换为配置结构
func paramsToConfig(params map[string]string) *Config {
	cfg := &Config{}

	// 应用配置
	cfg.App.Name = params["app/name"]
	cfg.App.Version = params["app/version"]
	cfg.App.Env = params["app/env"]
	cfg.App.Mode = params["app/mode"]
	cfg.App.Port = getIntOrDefault(params["app/port"], 80)
	cfg.App.BaseURL = params["app/base_url"]
	cfg.App.Region = params["app/region"]

	// 数据库配置
	cfg.Database.Driver = params["database/driver"]
	cfg.Database.Host = params["database/host"]
	cfg.Database.Port = getIntOrDefault(params["database/port"], 5432)
	cfg.Database.Name = params["database/name"]
	cfg.Database.User = params["database/user"]
	cfg.Database.Password = params["database/password"]
	cfg.Database.SSLMode = params["database/ssl_mode"]
	cfg.Database.MaxIdleConns = getIntOrDefault(params["database/max_idle_conns"], 10)
	cfg.Database.MaxOpenConns = getIntOrDefault(params["database/max_open_conns"], 100)
	cfg.Database.SSLTunnel = params["database/ssl_tunnel"] == "true"

	// Redis 配置
	cfg.Redis.Host = params["redis/host"]
	cfg.Redis.Port = getIntOrDefault(params["redis/port"], 6379)
	cfg.Redis.Password = params["redis/password"]
	cfg.Redis.DB = getIntOrDefault(params["redis/db"], 0)
	cfg.Redis.SSLTunnel = params["redis/ssl_tunnel"] == "true"
	cfg.Redis.TLSEnable = params["redis/tls_enable"] == "true"

	// Clerk 配置
	cfg.Clerk.APIKey = params["clerk/api_key"]
	cfg.Clerk.FrontendAPI = params["clerk/frontend_api"]
	cfg.Clerk.WebhookKey = params["clerk/webhook_key"]

	// OpenAI 配置
	cfg.OpenAI.APIKey = params["openai/api_key"]
	cfg.OpenAI.Organization = params["openai/org_id"]
	cfg.OpenAI.Model = "gpt-4-turbo-preview"
	cfg.OpenAI.MaxTokens = 2000
	cfg.OpenAI.Temperature = 0.7

	// Anthropic 配置
	cfg.Anthropic.APIKey = params["anthropic/api_key"]
	cfg.Anthropic.Model = "claude-3-opus"
	cfg.Anthropic.MaxTokens = 2000
	cfg.Anthropic.Temperature = 0.7

	// 中间件配置
	cfg.Middleware.RateLimit.Enabled = true
	cfg.Middleware.RateLimit.Limit = 100
	cfg.Middleware.RateLimit.Duration = time.Minute

	cfg.Middleware.CORS.AllowOrigins = []string{
		"https://getnicheflow.com",
		"https://www.getnicheflow.com",
		"http://localhost:3000", // 开发环境
	}
	cfg.Middleware.CORS.AllowMethods = []string{
		"GET",
		"POST",
		"PUT",
		"DELETE",
		"OPTIONS",
	}
	cfg.Middleware.CORS.AllowHeaders = []string{
		"Authorization",
		"Content-Type",
		"X-Clerk-User-Id",
	}
	cfg.Middleware.CORS.MaxAge = 300

	return cfg
}

// getRegionCode 获取区域代码
func getRegionCode(region string) string {
	switch region {
	case "ap-east-1":
		return "hk"
	case "us-east-1":
		return "us"
	default:
		return "hk"
	}
}

// getIntOrDefault 获取整数值或默认值
func getIntOrDefault(value string, defaultValue int) int {
	if value == "" {
		return defaultValue
	}
	var result int
	fmt.Sscanf(value, "%d", &result)
	return result
}
