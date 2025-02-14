#!/bin/bash

# 确保脚本在错误时退出
set -e

echo "开始部署 NicheFlow API..."

# 检查必要文件
if [ ! -f .env.production ]; then
    echo "错误：未找到 .env.production 文件"
    exit 1
fi

# 构建 Docker 镜像
echo "构建 Docker 镜像..."
docker-compose build --no-cache

# 停止旧容器
echo "停止旧容器..."
docker-compose down || true

# 启动新容器
echo "启动新容器..."
docker-compose up -d

# 等待服务启动
echo "等待服务启动..."
sleep 10

# 检查服务健康状态
echo "检查服务状态..."
if curl -f http://localhost:8080/api/health; then
    echo "部署成功！服务已启动并正常运行。"
else
    echo "警告：服务可能未正常启动，请检查日志。"
    docker-compose logs api
    exit 1
fi

# 清理未使用的镜像
echo "清理未使用的镜像..."
docker image prune -f

echo "部署完成！" 