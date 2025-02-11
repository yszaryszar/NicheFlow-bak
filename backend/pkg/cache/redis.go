package cache

import (
	"context"
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

	rdb = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
	})

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
