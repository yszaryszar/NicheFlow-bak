# 香港区域 ALB 安全组
resource "aws_security_group" "alb_hk" {
  provider    = aws.hk
  name        = "nicheflow-hk-alb-sg"
  description = "Security group for HK ALB"
  vpc_id      = var.vpc_id_hk

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nicheflow-hk-alb-sg"
    Environment = "production"
  }
}

# 美国区域 ALB 安全组
resource "aws_security_group" "alb_us" {
  provider    = aws.us
  name        = "nicheflow-us-alb-sg"
  description = "Security group for US ALB"
  vpc_id      = var.vpc_id_us

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "nicheflow-us-alb-sg"
    Environment = "production"
  }
} 