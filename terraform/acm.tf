# 香港区域证书
resource "aws_acm_certificate" "api_hk" {
  provider          = aws.hk
  domain_name       = "api.getnicheflow.com"
  subject_alternative_names = [
    "hk.api.getnicheflow.com",
    "*.api.getnicheflow.com"
  ]
  validation_method = "DNS"

  tags = {
    Name        = "nicheflow-api-certificate-hk"
    Environment = "production"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 美国区域证书
resource "aws_acm_certificate" "api_us" {
  provider          = aws.us
  domain_name       = "api.getnicheflow.com"
  subject_alternative_names = [
    "us.api.getnicheflow.com",
    "*.api.getnicheflow.com"
  ]
  validation_method = "DNS"

  tags = {
    Name        = "nicheflow-api-certificate-us"
    Environment = "production"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# 等待香港区域证书验证完成
resource "aws_acm_certificate_validation" "api_hk" {
  provider                = aws.hk
  certificate_arn         = aws_acm_certificate.api_hk.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation_hk : record.fqdn]

  timeouts {
    create = "45m"
  }
}

# 等待美国区域证书验证完成
resource "aws_acm_certificate_validation" "api_us" {
  provider                = aws.us
  certificate_arn         = aws_acm_certificate.api_us.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation_us : record.fqdn]

  timeouts {
    create = "45m"
  }
}

# 输出验证信息（用于调试）
output "hk_certificate_validation_records" {
  value = {
    for dvo in aws_acm_certificate.api_hk.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
}

output "us_certificate_validation_records" {
  value = {
    for dvo in aws_acm_certificate.api_us.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
} 