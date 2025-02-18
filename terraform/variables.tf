variable "vpc_id_hk" {
  description = "VPC ID for Hong Kong region"
  type        = string
}

variable "vpc_id_us" {
  description = "VPC ID for US region"
  type        = string
}

variable "public_subnets_hk" {
  description = "Public subnet IDs for Hong Kong region"
  type        = list(string)
}

variable "public_subnets_us" {
  description = "Public subnet IDs for US region"
  type        = list(string)
}

variable "ec2_instance_id_hk" {
  description = "EC2 instance ID for Hong Kong region"
  type        = string
}

variable "ec2_instance_id_us" {
  description = "EC2 instance ID for US region"
  type        = string
}

variable "db_host_hk" {
  description = "香港区域数据库主机地址"
  type        = string
}

variable "db_host_us" {
  description = "美国区域数据库主机地址"
  type        = string
}

variable "db_port" {
  description = "数据库端口"
  type        = string
  default     = "5432"
}

variable "db_name" {
  description = "数据库名称"
  type        = string
  default     = "nicheflow"
}

variable "db_user" {
  description = "数据库用户名"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "数据库密码"
  type        = string
  sensitive   = true
}

variable "redis_host_hk" {
  description = "香港区域 Redis 主机地址"
  type        = string
}

variable "redis_host_us" {
  description = "美国区域 Redis 主机地址"
  type        = string
}

variable "redis_port" {
  description = "Redis 端口"
  type        = string
  default     = "6379"
}

variable "clerk_api_key" {
  description = "Clerk API 密钥"
  type        = string
  sensitive   = true
}

variable "clerk_frontend_api" {
  description = "Clerk 前端 API"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API 密钥"
  type        = string
  sensitive   = true
}

# variable "openai_org_id" {
#   description = "OpenAI 组织 ID"
#   type        = string
#   sensitive   = true
# }

variable "anthropic_api_key" {
  description = "Anthropic API 密钥"
  type        = string
  sensitive   = true
}

variable "alert_email" {
  description = "告警通知邮箱地址"
  type        = string
  default     = "yszaryszar@gmail.com"
} 