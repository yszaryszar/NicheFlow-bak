# 香港区域监控告警
resource "aws_cloudwatch_metric_alarm" "hk_health" {
  provider            = aws.hk
  alarm_name          = "nicheflow-hk-health"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period             = "60"
  statistic          = "Average"
  threshold          = "1"
  alarm_description  = "香港区域健康主机数量低于阈值"
  alarm_actions      = [aws_sns_topic.alerts.arn]

  dimensions = {
    TargetGroup  = aws_lb_target_group.hk.arn_suffix
    LoadBalancer = aws_lb.hk.arn_suffix
  }
}

# 美国区域监控告警
resource "aws_cloudwatch_metric_alarm" "us_health" {
  provider            = aws.us
  alarm_name          = "nicheflow-us-health"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period             = "60"
  statistic          = "Average"
  threshold          = "1"
  alarm_description  = "美国区域健康主机数量低于阈值"
  alarm_actions      = [aws_sns_topic.alerts.arn]

  dimensions = {
    TargetGroup  = aws_lb_target_group.us.arn_suffix
    LoadBalancer = aws_lb.us.arn_suffix
  }
}

# 证书到期监控
resource "aws_cloudwatch_metric_alarm" "certificate_expiry" {
  provider            = aws.global
  alarm_name          = "nicheflow-cert-expiry"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "DaysToExpiry"
  namespace           = "AWS/CertificateManager"
  period             = "86400"
  statistic          = "Minimum"
  threshold          = "30"
  alarm_description  = "SSL证书将在30天内过期"
  alarm_actions      = [aws_sns_topic.alerts.arn]
}

# SNS 主题用于发送告警通知
resource "aws_sns_topic" "alerts" {
  provider = aws.global
  name     = "nicheflow-alerts"
}

# SNS 主题订阅（邮件通知）
resource "aws_sns_topic_subscription" "alerts_email" {
  provider  = aws.global
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "yszaryszar@gmail.com"
} 