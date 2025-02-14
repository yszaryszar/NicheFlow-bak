provider "aws" {
  alias  = "global"
  region = "us-east-1"  # Route53 需要在 us-east-1 区域配置
}

# 主域名区域
resource "aws_route53_zone" "main" {
  provider = aws.global
  name     = "getnicheflow.com"  # 修改为主域名
}

# 香港区域健康检查
resource "aws_route53_health_check" "hk" {
  provider          = aws.global
  fqdn              = "hk.api.getnicheflow.com"
  port              = 443
  type             = "HTTPS"
  resource_path     = "/health"  # 修改为实际的健康检查路径
  failure_threshold = "3"
  request_interval  = "30"

  tags = {
    Name = "nicheflow-hk-healthcheck"
  }
}

# 美国区域健康检查
resource "aws_route53_health_check" "us" {
  provider          = aws.global
  fqdn              = "us.api.getnicheflow.com"
  port              = 443
  type             = "HTTPS"
  resource_path     = "/health"  # 修改为实际的健康检查路径
  failure_threshold = "3"
  request_interval  = "30"

  tags = {
    Name = "nicheflow-us-healthcheck"
  }
}

# 香港区域 ALB 记录
resource "aws_route53_record" "hk_alb" {
  provider = aws.global
  zone_id  = aws_route53_zone.main.zone_id
  name     = "hk.api.getnicheflow.com"
  type     = "A"

  alias {
    name                   = aws_lb.hk.dns_name
    zone_id                = aws_lb.hk.zone_id
    evaluate_target_health = true
  }
}

# 美国区域 ALB 记录
resource "aws_route53_record" "us_alb" {
  provider = aws.global
  zone_id  = aws_route53_zone.main.zone_id
  name     = "us.api.getnicheflow.com"
  type     = "A"

  alias {
    name                   = aws_lb.us.dns_name
    zone_id                = aws_lb.us.zone_id
    evaluate_target_health = true
  }
}

# API 主域名 - 亚洲地区路由策略
resource "aws_route53_record" "api_asia" {
  provider = aws.global
  zone_id  = aws_route53_zone.main.zone_id
  name     = "api.getnicheflow.com"
  type     = "A"
  
  geolocation_routing_policy {
    continent = "AS"
  }

  set_identifier = "asia"
  
  alias {
    name                   = aws_lb.hk.dns_name
    zone_id                = aws_lb.hk.zone_id
    evaluate_target_health = true
  }

  health_check_id = aws_route53_health_check.hk.id
}

# API 主域名 - 北美地区路由策略
resource "aws_route53_record" "api_north_america" {
  provider = aws.global
  zone_id  = aws_route53_zone.main.zone_id
  name     = "api.getnicheflow.com"
  type     = "A"
  
  geolocation_routing_policy {
    continent = "NA"
  }

  set_identifier = "north_america"
  
  alias {
    name                   = aws_lb.us.dns_name
    zone_id                = aws_lb.us.zone_id
    evaluate_target_health = true
  }

  health_check_id = aws_route53_health_check.us.id
}

# API 主域名 - 默认路由策略（其他地区）
resource "aws_route53_record" "api_default" {
  provider = aws.global
  zone_id  = aws_route53_zone.main.zone_id
  name     = "api.getnicheflow.com"
  type     = "A"
  
  geolocation_routing_policy {
    country = "*"
  }

  set_identifier = "default"
  
  alias {
    name                   = aws_lb.hk.dns_name
    zone_id                = aws_lb.hk.zone_id
    evaluate_target_health = true
  }

  health_check_id = aws_route53_health_check.hk.id
} 