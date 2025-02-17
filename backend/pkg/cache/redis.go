// Package cache 提供缓存服务管理功能
// 包含 Redis 缓存客户端的连接管理、配置和操作接口
// 支持 AWS ElastiCache 和标准 Redis 服务器
package cache

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"

	"github.com/go-redis/redis/v8"
	"github.com/yszaryszar/NicheFlow/backend/internal/config"
)

// 全局 Redis 客户端实例
var rdb *redis.Client

// NewRedisClient 创建 Redis 客户端连接
//
// 参数:
//   - cfg: Redis 配置对象，包含连接参数和 TLS 设置
//
// 返回:
//   - *redis.Client: Redis 客户端实例
//   - error: 创建过程中的错误，如果成功则为 nil
//
// 说明:
//
//	该函数完成以下配置：
//	1. 设置基本连接参数（地址、密码、数据库）
//	2. 配置 TLS 连接（如果启用）
//	3. 测试连接可用性
//	4. 返回可用的客户端实例
func NewRedisClient(cfg *config.RedisConfig) (*redis.Client, error) {
	if rdb != nil {
		return rdb, nil
	}

	// 基本连接配置
	options := &redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port), // Redis 服务器地址
		Password: cfg.Password,                             // 访问密码
		DB:       cfg.DB,                                   // 数据库编号
	}

	// TLS 配置 (AWS ElastiCache)
	if cfg.TLSEnable {
		options.TLSConfig = &tls.Config{
			MinVersion:         tls.VersionTLS12,
			InsecureSkipVerify: true, // AWS ElastiCache 使用自签名证书
		}
	}

	// 创建客户端实例
	rdb = redis.NewClient(options)

	// 测试连接可用性
	ctx := context.Background()
	if err := rdb.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("连接 Redis 失败: %w", err)
	}

	log.Println("Redis 连接成功")
	return rdb, nil
}

// GetRedis 获取 Redis 客户端实例
//
// 返回:
//   - *redis.Client: 全局 Redis 客户端实例
//
// 说明:
//
//	返回已初始化的 Redis 客户端实例
//	如果客户端未初始化，返回 nil
func GetRedis() *redis.Client {
	return rdb
}

// Close 关闭 Redis 连接
//
// 返回:
//   - error: 关闭过程中的错误，如果成功则为 nil
//
// 说明:
//
//	安全地关闭 Redis 连接
//	在应用程序退出时调用
func Close() error {
	if rdb != nil {
		return rdb.Close()
	}
	return nil
}
