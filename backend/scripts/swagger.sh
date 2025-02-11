#!/bin/bash

# 确保 swag 命令已安装
if ! command -v swag &> /dev/null; then
    echo "正在安装 swag..."
    go install github.com/swaggo/swag/cmd/swag@latest
fi

# 生成 swagger 文档
echo "正在生成 Swagger 文档..."
swag init -g cmd/api/main.go -o docs

echo "Swagger 文档生成完成！" 