# 香港区域证书配置
provider "aws" {
  alias  = "hk"
  region = "ap-east-1"
}

resource "aws_acm_certificate" "hk" {
  provider          = aws.hk
  domain_name       = "api.getnicheflow.com"
  validation_method = "DNS"
  
  subject_alternative_names = ["hk.api.getnicheflow.com"]

  tags = {
    Name = "nicheflow-hk-cert"
    Environment = "production"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 香港区域证书验证记录
resource "aws_route53_record" "hk_validation" {
  provider = aws.global
  for_each = {
    for dvo in aws_acm_certificate.hk.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

# 香港区域证书验证
resource "aws_acm_certificate_validation" "hk" {
  provider                = aws.hk
  certificate_arn         = aws_acm_certificate.hk.arn
  validation_record_fqdns = [for record in aws_route53_record.hk_validation : record.fqdn]
}

# 美国区域证书配置
provider "aws" {
  alias  = "us"
  region = "us-east-1"
}

resource "aws_acm_certificate" "us" {
  provider          = aws.us
  domain_name       = "api.getnicheflow.com"
  validation_method = "DNS"
  
  subject_alternative_names = ["us.api.getnicheflow.com"]

  tags = {
    Name = "nicheflow-us-cert"
    Environment = "production"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 美国区域证书验证记录
resource "aws_route53_record" "us_validation" {
  provider = aws.global
  for_each = {
    for dvo in aws_acm_certificate.us.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

# 美国区域证书验证
resource "aws_acm_certificate_validation" "us" {
  provider                = aws.us
  certificate_arn         = aws_acm_certificate.us.arn
  validation_record_fqdns = [for record in aws_route53_record.us_validation : record.fqdn]
} 