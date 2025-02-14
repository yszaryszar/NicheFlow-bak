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