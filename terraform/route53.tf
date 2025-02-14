provider "aws" {
  alias  = "global"
  region = "us-east-1"  # Route53 需要在 us-east-1 区域配置
}

resource "aws_route53_zone" "main" {
  provider = aws.global
  name     = "api.nicheflow.com"
}

resource "aws_route53_health_check" "hk" {
  provider          = aws.global
  fqdn              = "hk.api.nicheflow.com"
  port              = 443
  type             = "HTTPS"
  resource_path     = "/api/health"
  failure_threshold = "3"
  request_interval  = "30"

  tags = {
    Name = "hk-healthcheck"
  }
}

resource "aws_route53_health_check" "us" {
  provider          = aws.global
  fqdn              = "us.api.nicheflow.com"
  port              = 443
  type             = "HTTPS"
  resource_path     = "/api/health"
  failure_threshold = "3"
  request_interval  = "30"

  tags = {
    Name = "us-healthcheck"
  }
}

# 亚洲地区路由策略
resource "aws_route53_record" "asia" {
  provider = aws.global
  zone_id  = aws_route53_zone.main.zone_id
  name     = "api.nicheflow.com"
  type     = "A"
  
  geolocation_routing_policy {
    continent = "AS"
  }

  set_identifier = "asia"
  
  alias {
    name                   = "hk.api.nicheflow.com"
    zone_id                = aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

# 北美地区路由策略
resource "aws_route53_record" "north_america" {
  provider = aws.global
  zone_id  = aws_route53_zone.main.zone_id
  name     = "api.nicheflow.com"
  type     = "A"
  
  geolocation_routing_policy {
    continent = "NA"
  }

  set_identifier = "north_america"
  
  alias {
    name                   = "us.api.nicheflow.com"
    zone_id                = aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

# 默认路由策略（其他地区）
resource "aws_route53_record" "default" {
  provider = aws.global
  zone_id  = aws_route53_zone.main.zone_id
  name     = "api.nicheflow.com"
  type     = "A"
  
  geolocation_routing_policy {
    country = "*"
  }

  set_identifier = "default"
  
  # 默认使用延迟最低的节点
  latency_routing_policy {
    region = "ap-east-1"  # 香港区域
  }
  
  alias {
    name                   = "hk.api.nicheflow.com"
    zone_id                = aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
} 