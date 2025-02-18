# 构建阶段
FROM golang:1.23.5-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装基础工具
RUN apk add --no-cache git

# 复制 go.mod 和 go.sum
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -o nicheflow-api ./cmd/api

# 运行阶段
FROM alpine:latest

# 安装基础工具和 AWS CLI
RUN apk --no-cache add \
    ca-certificates \
    tzdata \
    python3 \
    py3-pip \
    && pip3 install --no-cache-dir awscli \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

# 创建非 root 用户
RUN adduser -D -g '' nicheflow

# 创建必要的目录
RUN mkdir -p /app \
    && chown -R nicheflow:nicheflow /app

# 从构建阶段复制二进制文件
COPY --from=builder /app/nicheflow-api /app/

# 设置环境变量
ENV APP_ENV=production

# 切换到非 root 用户
USER nicheflow

# 设置工作目录
WORKDIR /app

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["./nicheflow-api"] 