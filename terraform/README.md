# NicheFlow 基础设施配置

本目录包含 NicheFlow 项目的基础设施即代码 (IaC) 配置，使用 Terraform 管理 AWS 资源。

## 架构概览

项目采用多区域部署架构：
- 香港区域 (ap-east-1)：主要服务亚太地区用户
- 美国区域 (us-east-1)：主要服务北美地区用户

### 核心组件

1. **负载均衡 (ALB)**
   - 香港区域：`nicheflow-hk-alb`
   - 美国区域：`nicheflow-us-alb`
   - 配置文件：`alb.tf`

2. **SSL 证书 (ACM)**
   - 主域名：`api.getnicheflow.com`
   - 区域子域名：`hk.api.getnicheflow.com`, `us.api.getnicheflow.com`
   - 配置文件：`acm.tf`

3. **DNS 路由 (Route53)**
   - 基于地理位置的智能路由
   - 自动故障转移
   - 配置文件：`route53.tf`

4. **监控告警 (CloudWatch)**
   - 服务健康检查
   - 证书到期监控
   - 配置文件：`monitoring.tf`

5. **安全组配置**
   - ALB 安全组
   - 配置文件：`security.tf`

## 前置条件

1. 安装 Terraform (推荐版本 >= 1.0.0)
2. 配置 AWS 凭证
3. 准备好以下资源：
   - VPC ID (香港和美国区域)
   - 公共子网 ID (每个区域至少 2 个)
   - EC2 实例 ID (用于目标组)

## 配置说明

1. **变量配置**
   复制 `terraform.tfvars.example` 并重命名为 `terraform.tfvars`，填入必要的配置：
   ```hcl
   vpc_id_hk = "vpc-xxx"
   vpc_id_us = "vpc-xxx"
   public_subnets_hk = ["subnet-xxx", "subnet-xxx"]
   public_subnets_us = ["subnet-xxx", "subnet-xxx"]
   ec2_instance_id_hk = "i-xxx"
   ec2_instance_id_us = "i-xxx"
   ```

2. **监控配置**
   在 `monitoring.tf` 中更新告警接收邮箱：
   ```hcl
   endpoint = "your-email@example.com"
   ```

## 使用方法

1. **初始化 Terraform**
   ```bash
   terraform init
   ```

2. **查看变更计划**
   ```bash
   terraform plan
   ```

3. **应用配置**
   ```bash
   terraform apply
   ```

4. **销毁资源**（谨慎使用）
   ```bash
   terraform destroy
   ```

## 注意事项

1. **证书验证**
   - 首次部署时需要在 AWS Console 中确认证书验证邮件
   - 证书自动续期，但建议关注过期告警

2. **DNS 传播**
   - DNS 变更可能需要最多 48 小时全球生效
   - 建议使用 dig 或 nslookup 验证 DNS 记录

3. **健康检查**
   - 确保后端服务正确响应 `/health` 路径
   - 健康检查失败会触发告警通知

4. **成本优化**
   - ALB 和跨区域流量会产生费用
   - 建议配置成本告警

## 文件结构

```
terraform/
├── acm.tf          # SSL 证书配置
├── alb.tf          # 应用负载均衡器配置
├── monitoring.tf   # 监控告警配置
├── providers.tf    # AWS 提供商配置
├── route53.tf      # DNS 路由配置
├── security.tf     # 安全组配置
├── variables.tf    # 变量定义
└── terraform.tfvars # 变量值配置
```

## 故障排除

1. **证书验证失败**
   - 检查 Route53 记录是否正确创建
   - 确认域名所有权验证是否完成

2. **健康检查失败**
   - 验证后端服务是否正常运行
   - 检查安全组规则是否正确配置
   - 确认目标组配置是否正确

3. **DNS 解析问题**
   - 使用 dig 工具验证 DNS 记录
   - 检查地理位置路由策略是否生效

## 维护建议

1. 定期检查并更新 Terraform 版本
2. 保持对 AWS 提供商的更新
3. 定期验证备份和恢复流程
4. 监控成本和资源使用情况

## 联系支持

如有问题，请联系：
- 技术支持：support@getnicheflow.com
- 运维团队：ops@getnicheflow.com 