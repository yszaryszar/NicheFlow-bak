# NicheFlow 基础设施配置

本目录包含 NicheFlow 项目的基础设施即代码 (IaC) 配置，使用 Terraform 管理 AWS 资源。

## 基础设施架构

项目采用多区域部署策略：
- 香港区域 (ap-east-1)：服务亚太地区用户
- 美国区域 (us-east-1)：服务北美地区用户

### 主要组件

1. **负载均衡 (ALB)**
   - 香港区域：`nicheflow-hk-alb`
   - 美国区域：`nicheflow-us-alb`
   - HTTPS 监听器（端口 443）
   - HTTP 自动跳转至 HTTPS

2. **SSL 证书 (ACM)**
   - 主域名：`api.getnicheflow.com`
   - 区域子域名：
     - 香港：`hk.api.getnicheflow.com`
     - 美国：`us.api.getnicheflow.com`
   - 自动验证和续期

3. **DNS 路由 (Route53)**
   - 基于地理位置的路由策略
   - 健康检查和故障转移
   - 自动 DNS 验证

4. **监控告警 (CloudWatch)**
   - 目标组健康状态监控
   - 证书到期提醒
   - SNS 通知

## 配置说明

1. 复制示例配置文件：
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. 更新变量值：
   - VPC ID
   - 子网 ID
   - EC2 实例 ID

3. 初始化 Terraform：
   ```bash
   terraform init
   ```

4. 检查计划：
   ```bash
   terraform plan
   ```

5. 应用配置：
   ```bash
   terraform apply
   ```

## 注意事项

1. 证书验证
   - 首次部署时证书验证可能需要 15-30 分钟
   - 需要等待 DNS 记录传播完成

2. 健康检查
   - 确保后端服务正常运行
   - 检查安全组配置
   - 验证目标组设置

3. 成本优化
   - 使用适当的实例类型
   - 监控资源使用情况
   - 及时清理未使用的资源

## 维护支持

如有问题请联系：
- 邮件：yszaryszar@gmail.com
- 文档：[开发指南](../docs/development_guide.md)

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