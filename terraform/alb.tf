# 香港区域 ALB 配置
resource "aws_lb" "hk" {
  provider           = aws.hk
  name               = "nicheflow-hk-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_hk.id]
  subnets            = var.public_subnets_hk

  tags = {
    Name = "nicheflow-hk-alb"
    Environment = "production"
  }
}

resource "aws_lb_listener" "hk_https" {
  provider          = aws.hk
  load_balancer_arn = aws_lb.hk.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.api_hk.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.hk.arn
  }

  # 暂时注释掉证书验证依赖
  # depends_on = [aws_acm_certificate_validation.hk]
}

resource "aws_lb_listener" "hk_http" {
  provider          = aws.hk
  load_balancer_arn = aws_lb.hk.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_target_group" "hk" {
  provider    = aws.hk
  name        = "nicheflow-hk-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id_hk
  target_type = "instance"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher            = "200"
    path               = "/health"
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "nicheflow-hk-tg"
    Environment = "production"
  }
}

# 香港区域 EC2 目标组附加
resource "aws_lb_target_group_attachment" "hk" {
  provider         = aws.hk
  target_group_arn = aws_lb_target_group.hk.arn
  target_id        = var.ec2_instance_id_hk  # 需要在 variables.tf 中定义
  port             = 80
}

# 美国区域 ALB 配置
resource "aws_lb" "us" {
  provider           = aws.us
  name               = "nicheflow-us-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_us.id]
  subnets            = var.public_subnets_us

  tags = {
    Name = "nicheflow-us-alb"
    Environment = "production"
  }
}

resource "aws_lb_listener" "us_https" {
  provider          = aws.us
  load_balancer_arn = aws_lb.us.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate_validation.api_us.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.us.arn
  }

  # 暂时注释掉证书验证依赖
  # depends_on = [aws_acm_certificate_validation.us]
}

resource "aws_lb_listener" "us_http" {
  provider          = aws.us
  load_balancer_arn = aws_lb.us.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# 美国区域目标组配置
resource "aws_lb_target_group" "us" {
  provider    = aws.us
  name        = "nicheflow-us-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id_us
  target_type = "instance"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher            = "200"
    path               = "/health"
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 2
  }

  tags = {
    Name = "nicheflow-us-tg"
    Environment = "production"
  }
}

# 美国区域 EC2 目标组附加
resource "aws_lb_target_group_attachment" "us" {
  provider         = aws.us
  target_group_arn = aws_lb_target_group.us.arn
  target_id        = var.ec2_instance_id_us  # 需要在 variables.tf 中定义
  port             = 80
} 