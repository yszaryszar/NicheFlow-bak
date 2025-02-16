# 共享配置
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  required_version = ">= 1.0"

  # 如果使用远程状态存储，取消下面注释
  # backend "s3" {
  #   bucket = "nicheflow-terraform-state"
  #   key    = "global/s3/terraform.tfstate"
  #   region = "us-east-1"
  #   
  #   dynamodb_table = "nicheflow-terraform-locks"
  #   encrypt        = true
  # }
}

# 默认 provider 配置（用于全局资源）
provider "aws" {
  region = "us-east-1"  # 默认使用美国东部区域
  
  default_tags {
    tags = {
      Project     = "NicheFlow"
      Environment = "Production"
      Terraform   = "true"
      ManagedBy   = "Terraform"
    }
  }
}

# 全局 provider 配置（专用于 Route53 和全局服务）
provider "aws" {
  alias  = "global"
  region = "us-east-1"  # Route53 使用 us-east-1 作为全局区域
  
  default_tags {
    tags = {
      Project     = "NicheFlow"
      Environment = "Production"
      Terraform   = "true"
      ManagedBy   = "Terraform"
      Service     = "Global"
    }
  }
}

# 香港区域 provider 配置
provider "aws" {
  alias  = "hk"
  region = "ap-east-1"
  
  default_tags {
    tags = {
      Project     = "NicheFlow"
      Environment = "Production"
      Terraform   = "true"
      ManagedBy   = "Terraform"
      Region      = "HongKong"
    }
  }
}

# 美国区域 provider 配置
provider "aws" {
  alias  = "us"
  region = "us-east-1"
  
  default_tags {
    tags = {
      Project     = "NicheFlow"
      Environment = "Production"
      Terraform   = "true"
      ManagedBy   = "Terraform"
      Region      = "USEast"
    }
  }
} 