# KMS 密钥配置
resource "aws_kms_key" "config" {
  description             = "用于加密 NicheFlow 配置参数的 KMS 密钥"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "nicheflow-config-key"
    Environment = "production"
  }
}

resource "aws_kms_alias" "config" {
  name          = "alias/nicheflow-config"
  target_key_id = aws_kms_key.config.key_id
}

# 开发环境参数
locals {
  dev_hk_parameters = {
    # 应用配置
    "/nicheflow/development/hk/app/name"     = "NicheFlow"
    "/nicheflow/development/hk/app/env"      = "development"
    "/nicheflow/development/hk/app/mode"     = "debug"
    "/nicheflow/development/hk/app/port"     = "8080"
    "/nicheflow/development/hk/app/base_url" = "http://localhost:8080"
    "/nicheflow/development/hk/app/region"   = "ap-east-1"

    # 数据库配置
    "/nicheflow/development/hk/database/driver"           = "postgres"
    "/nicheflow/development/hk/database/host"            = "127.0.0.1"
    "/nicheflow/development/hk/database/port"            = "5432"
    "/nicheflow/development/hk/database/name"            = "nicheflow_dev"
    "/nicheflow/development/hk/database/user"            = "postgres"
    "/nicheflow/development/hk/database/ssl_mode"        = "disable"
    "/nicheflow/development/hk/database/max_idle_conns"  = "10"
    "/nicheflow/development/hk/database/max_open_conns"  = "100"
    "/nicheflow/development/hk/database/ssl_tunnel"      = "false"

    # Redis 配置
    "/nicheflow/development/hk/redis/host"       = "127.0.0.1"
    "/nicheflow/development/hk/redis/port"       = "6379"
    "/nicheflow/development/hk/redis/db"         = "0"
    "/nicheflow/development/hk/redis/ssl_tunnel" = "true"
    "/nicheflow/development/hk/redis/tls_enable" = "true"
    "/nicheflow/development/hk/redis/tls_cert_file" = "certs/redis/client.crt"
    "/nicheflow/development/hk/redis/tls_key_file"  = "certs/redis/client.key"
    "/nicheflow/development/hk/redis/tls_ca_file"   = "certs/redis/ca.crt"
  }

  dev_us_parameters = {
    # 应用配置
    "/nicheflow/development/us/app/name"     = "NicheFlow"
    "/nicheflow/development/us/app/env"      = "development"
    "/nicheflow/development/us/app/mode"     = "debug"
    "/nicheflow/development/us/app/port"     = "8080"
    "/nicheflow/development/us/app/base_url" = "http://localhost:8080"
    "/nicheflow/development/us/app/region"   = "us-east-1"

    # 数据库配置
    "/nicheflow/development/us/database/driver"           = "postgres"
    "/nicheflow/development/us/database/host"            = "127.0.0.1"
    "/nicheflow/development/us/database/port"            = "5432"
    "/nicheflow/development/us/database/name"            = "nicheflow_dev"
    "/nicheflow/development/us/database/user"            = "postgres"
    "/nicheflow/development/us/database/ssl_mode"        = "disable"
    "/nicheflow/development/us/database/max_idle_conns"  = "10"
    "/nicheflow/development/us/database/max_open_conns"  = "100"
    "/nicheflow/development/us/database/ssl_tunnel"      = "false"

    # Redis 配置
    "/nicheflow/development/us/redis/host"       = "127.0.0.1"
    "/nicheflow/development/us/redis/port"       = "6379"
    "/nicheflow/development/us/redis/db"         = "0"
    "/nicheflow/development/us/redis/ssl_tunnel" = "true"
    "/nicheflow/development/us/redis/tls_enable" = "true"
    "/nicheflow/development/us/redis/tls_cert_file" = "certs/redis/client.crt"
    "/nicheflow/development/us/redis/tls_key_file"  = "certs/redis/client.key"
    "/nicheflow/development/us/redis/tls_ca_file"   = "certs/redis/ca.crt"
  }
}

# 生产环境参数
locals {
  prod_hk_parameters = {
    # 应用配置
    "/nicheflow/production/hk/app/name"     = "NicheFlow"
    "/nicheflow/production/hk/app/env"      = "production"
    "/nicheflow/production/hk/app/mode"     = "release"
    "/nicheflow/production/hk/app/port"     = "80"
    "/nicheflow/production/hk/app/base_url" = "https://api.getnicheflow.com"
    "/nicheflow/production/hk/app/region"   = "ap-east-1"

    # 数据库配置
    "/nicheflow/production/hk/database/driver"           = "postgres"
    "/nicheflow/production/hk/database/host"            = var.db_host_hk
    "/nicheflow/production/hk/database/port"            = var.db_port
    "/nicheflow/production/hk/database/name"            = var.db_name
    "/nicheflow/production/hk/database/user"            = var.db_user
    "/nicheflow/production/hk/database/ssl_mode"        = "require"
    "/nicheflow/production/hk/database/max_idle_conns"  = "20"
    "/nicheflow/production/hk/database/max_open_conns"  = "200"
    "/nicheflow/production/hk/database/ssl_tunnel"      = "true"

    # Redis 配置
    "/nicheflow/production/hk/redis/host"      = var.redis_host_hk
    "/nicheflow/production/hk/redis/port"      = var.redis_port
    "/nicheflow/production/hk/redis/db"        = "0"
    "/nicheflow/production/hk/redis/ssl_tunnel" = "false"
    "/nicheflow/production/hk/redis/tls_enable" = "true"
  }

  prod_us_parameters = {
    # 应用配置
    "/nicheflow/production/us/app/name"     = "NicheFlow"
    "/nicheflow/production/us/app/env"      = "production"
    "/nicheflow/production/us/app/mode"     = "release"
    "/nicheflow/production/us/app/port"     = "80"
    "/nicheflow/production/us/app/base_url" = "https://api.getnicheflow.com"
    "/nicheflow/production/us/app/region"   = "us-east-1"

    # 数据库配置
    "/nicheflow/production/us/database/driver"           = "postgres"
    "/nicheflow/production/us/database/host"            = var.db_host_us
    "/nicheflow/production/us/database/port"            = var.db_port
    "/nicheflow/production/us/database/name"            = var.db_name
    "/nicheflow/production/us/database/user"            = var.db_user
    "/nicheflow/production/us/database/ssl_mode"        = "require"
    "/nicheflow/production/us/database/max_idle_conns"  = "20"
    "/nicheflow/production/us/database/max_open_conns"  = "200"
    "/nicheflow/production/us/database/ssl_tunnel"      = "true"

    # Redis 配置
    "/nicheflow/production/us/redis/host"      = var.redis_host_us
    "/nicheflow/production/us/redis/port"      = var.redis_port
    "/nicheflow/production/us/redis/db"        = "0"
    "/nicheflow/production/us/redis/ssl_tunnel" = "false"
    "/nicheflow/production/us/redis/tls_enable" = "true"
  }
}

# 开发环境参数资源
resource "aws_ssm_parameter" "dev_hk_parameters" {
  provider = aws.hk
  for_each = local.dev_hk_parameters

  name  = each.key
  type  = "String"
  value = each.value

  tags = {
    Environment = "development"
    Region     = "hk"
  }
}

resource "aws_ssm_parameter" "dev_us_parameters" {
  provider = aws.us
  for_each = local.dev_us_parameters

  name  = each.key
  type  = "String"
  value = each.value

  tags = {
    Environment = "development"
    Region     = "us"
  }
}

# 生产环境参数资源
resource "aws_ssm_parameter" "prod_hk_parameters" {
  provider = aws.hk
  for_each = local.prod_hk_parameters

  name  = each.key
  type  = "String"
  value = each.value

  tags = {
    Environment = "production"
    Region     = "hk"
  }
}

resource "aws_ssm_parameter" "prod_us_parameters" {
  provider = aws.us
  for_each = local.prod_us_parameters

  name  = each.key
  type  = "String"
  value = each.value

  tags = {
    Environment = "production"
    Region     = "us"
  }
}

# 敏感参数配置
locals {
  dev_secure_parameters = {
    # 数据库密码
    "/nicheflow/development/hk/database/password" = "postgres"
    "/nicheflow/development/us/database/password" = "postgres"

    # Clerk 配置
    "/nicheflow/development/hk/clerk/api_key"      = "test_key"
    "/nicheflow/development/hk/clerk/frontend_api" = "test_frontend_api"
    "/nicheflow/development/us/clerk/api_key"      = "test_key"
    "/nicheflow/development/us/clerk/frontend_api" = "test_frontend_api"

    # OpenAI 配置
    "/nicheflow/development/hk/openai/api_key" = "test_key"
    "/nicheflow/development/us/openai/api_key" = "test_key"

    # Anthropic 配置
    "/nicheflow/development/hk/anthropic/api_key" = "test_key"
    "/nicheflow/development/us/anthropic/api_key" = "test_key"
  }

  prod_secure_parameters = {
    # 数据库密码
    "/nicheflow/production/hk/database/password" = var.db_password
    "/nicheflow/production/us/database/password" = var.db_password

    # Clerk 配置
    "/nicheflow/production/hk/clerk/api_key"      = var.clerk_api_key
    "/nicheflow/production/hk/clerk/frontend_api" = var.clerk_frontend_api
    "/nicheflow/production/us/clerk/api_key"      = var.clerk_api_key
    "/nicheflow/production/us/clerk/frontend_api" = var.clerk_frontend_api

    # OpenAI 配置
    "/nicheflow/production/hk/openai/api_key" = var.openai_api_key
    "/nicheflow/production/us/openai/api_key" = var.openai_api_key

    # Anthropic 配置
    "/nicheflow/production/hk/anthropic/api_key" = var.anthropic_api_key
    "/nicheflow/production/us/anthropic/api_key" = var.anthropic_api_key
  }
}

# 开发环境敏感参数资源
resource "aws_ssm_parameter" "dev_secure_parameters" {
  provider = aws.us
  for_each = local.dev_secure_parameters

  name   = each.key
  type   = "SecureString"
  value  = each.value
  key_id = aws_kms_key.config.id

  tags = {
    Environment = "development"
  }
}

# 生产环境敏感参数资源
resource "aws_ssm_parameter" "prod_secure_parameters" {
  provider = aws.us
  for_each = local.prod_secure_parameters

  name   = each.key
  type   = "SecureString"
  value  = each.value
  key_id = aws_kms_key.config.id

  tags = {
    Environment = "production"
  }
} 