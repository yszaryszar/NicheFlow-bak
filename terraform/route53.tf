# 使用已存在的托管区域而不是创建新的
data "aws_route53_zone" "main" {
  zone_id = "Z04430703085V5Z149VRP"  # 使用 Route53 注册商创建的区域
  private_zone = false
}

# 香港区域健康检查
resource "aws_route53_health_check" "hk" {
  provider             = aws.global
  fqdn                 = "hk.api.getnicheflow.com"
  port                 = 443
  type                 = "HTTPS"
  resource_path        = "/health"
  failure_threshold    = "3"
  request_interval     = "30"
  measure_latency      = true
  invert_healthcheck   = false
  disabled            = false
  enable_sni          = true

  tags = {
    Name        = "nicheflow-hk-healthcheck"
    Environment = "production"
    Region      = "HongKong"
    Service     = "API"
  }
}

# 美国区域健康检查
resource "aws_route53_health_check" "us" {
  provider             = aws.global
  fqdn                 = "us.api.getnicheflow.com"
  port                 = 443
  type                 = "HTTPS"
  resource_path        = "/health"
  failure_threshold    = "3"
  request_interval     = "30"
  measure_latency      = true
  invert_healthcheck   = false
  disabled            = false
  enable_sni          = true

  tags = {
    Name        = "nicheflow-us-healthcheck"
    Environment = "production"
    Region      = "USEast"
    Service     = "API"
  }
}

# 香港区域 ALB 记录
resource "aws_route53_record" "hk_alb" {
  provider = aws.global
  zone_id  = data.aws_route53_zone.main.zone_id
  name     = "hk.api.getnicheflow.com"
  type     = "A"

  alias {
    name                   = aws_lb.hk.dns_name
    zone_id                = aws_lb.hk.zone_id
    evaluate_target_health = true
  }

  depends_on = [aws_lb.hk]
}

# 美国区域 ALB 记录
resource "aws_route53_record" "us_alb" {
  provider = aws.global
  zone_id  = data.aws_route53_zone.main.zone_id
  name     = "us.api.getnicheflow.com"
  type     = "A"

  alias {
    name                   = aws_lb.us.dns_name
    zone_id                = aws_lb.us.zone_id
    evaluate_target_health = true
  }

  depends_on = [aws_lb.us]
}

# API 主域名 - 亚洲地区路由策略
resource "aws_route53_record" "api_asia" {
  provider = aws.global
  zone_id  = data.aws_route53_zone.main.zone_id
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
  
  depends_on = [
    aws_lb.hk,
    aws_route53_health_check.hk
  ]
}

# API 主域名 - 北美地区路由策略
resource "aws_route53_record" "api_north_america" {
  provider = aws.global
  zone_id  = data.aws_route53_zone.main.zone_id
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
  
  depends_on = [
    aws_lb.us,
    aws_route53_health_check.us
  ]
}

# API 主域名 - 默认路由策略（其他地区）
resource "aws_route53_record" "api_default" {
  provider = aws.global
  zone_id  = data.aws_route53_zone.main.zone_id
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
  
  depends_on = [
    aws_lb.hk,
    aws_route53_health_check.hk
  ]
}

# 香港区域证书的 DNS 验证记录
resource "aws_route53_record" "acm_validation_hk" {
  for_each = {
    for dvo in aws_acm_certificate.api_hk.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  provider = aws.global
  zone_id  = data.aws_route53_zone.main.zone_id
  name     = each.value.name
  type     = each.value.type
  records  = [each.value.record]
  ttl      = 60

  allow_overwrite = true
}

# 美国区域证书的 DNS 验证记录
resource "aws_route53_record" "acm_validation_us" {
  for_each = {
    for dvo in aws_acm_certificate.api_us.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  provider = aws.global
  zone_id  = data.aws_route53_zone.main.zone_id
  name     = each.value.name
  type     = each.value.type
  records  = [each.value.record]
  ttl      = 60

  allow_overwrite = true
} 