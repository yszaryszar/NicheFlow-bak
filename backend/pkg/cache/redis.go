package cache

import (
	"context"
	"crypto/tls"
	"fmt"

	"github.com/go-redis/redis/v8"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
)

var rdb *redis.Client

// NewRedisClient 创建 Redis 客户端连接
func NewRedisClient(cfg *config.RedisConfig) (*redis.Client, error) {
	if rdb != nil {
		return rdb, nil
	}

	options := &redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
	}

	// AWS ElastiCache 的 TLS 配置
	if cfg.TLSEnable {
		options.TLSConfig = &tls.Config{
			MinVersion: tls.VersionTLS12,
			// 安全说明：
			// 1. Redis 实例通过 AWS 安全组限制只允许特定 EC2 访问
			// 2. 所有连接都通过 SSH 隧道加密传输
			// 3. ElastiCache 在 VPC 内部，网络环境受控
			// 因此跳过证书验证是安全的
			InsecureSkipVerify: true,
		}
	}

	rdb = redis.NewClient(options)

	// 测试连接
	ctx := context.Background()
	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("连接 Redis 失败: %w", err)
	}

	return rdb, nil
}

// GetRedis 获取 Redis 客户端
func GetRedis() *redis.Client {
	return rdb
}

// Close 关闭 Redis 连接
func Close() error {
	if rdb != nil {
		return rdb.Close()
	}
	return nil
}
