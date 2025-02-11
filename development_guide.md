# NicheFlow 项目开发指南

## 1. 项目概述

- **项目名称:** 垂直平台爆款智造 (NicheFlow)
- **定位:** AI 驱动的垂直平台内容创作助手
- **目标用户:** TikTok 博主、独立站卖家、短视频创作者等
- **MVP 功能:** TikTok 爆款脚本生成器

## 2. 技术栈

### 前端

- Next.js 15 + Turbopack + React 18 + TypeScript
- Zustand (客户端状态管理)
- TanStack Query (服务端状态管理)
- Ant Design + Tailwind CSS
- next-i18next (国际化)

### 后端

- Go 1.23.5 + Gin
- GORM + PostgreSQL
- Redis (缓存)
- OpenAI/Claude API

### 部署

- 前端: Vercel/Netlify
- 后端: AWS
- 数据库: AWS RDS + ElastiCache

### 项目配置信息

- 前端 .env + dotenv-cli 多环境管理
- 后端 YAML + 环境变量 + viper 配置库 + godotenv 加载环境变量

## 3. 系统架构

### 前端架构

```text
frontend/
├── app/                # Next.js App Router
├── components/         # React组件
├── lib/               # 工具库
├── state/             # 状态管理
└── styles/            # 样式文件
```

### 后端架构

```text
backend/
├── handler/           # API控制器
├── service/           # 业务逻辑
├── repository/        # 数据访问
└── model/            # 数据模型
```

## 4. 开发规范

### 代码规范

#### 前端规范

- 使用 ESLint + Prettier 进行代码检查和格式化
- 组件命名采用 PascalCase (如 `UserProfile.tsx`)
- 文件命名采用 kebab-case (如 `user-profile.tsx`)
- 变量/函数命名采用 camelCase (如 `userName`, `handleSubmit`)
- 常量使用 UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- 每个组件一个文件,按功能分组存放
- 必须添加适当的类型注解
- 组件 props 必须定义接口
- 避免内联样式,使用 Tailwind 类或 CSS Modules

#### 后端规范

- 使用 gofmt + golangci-lint 进行代码检查和格式化
- 文件命名采用 snake_case (如 `user_service.go`)
- 结构体/接口采用 PascalCase (如 `type UserService interface {}`)
- 变量/函数采用 camelCase (如 `userID`, `getUser`)
- 常量使用 UPPER_SNAKE_CASE (如 `MAX_RETRY_COUNT`)
- 每个包按职责单一原则组织
- 必须处理所有错误返回
- 必须添加适当的注释
- API 路径使用 kebab-case (如 `/api/user-profile`)

### Git 工作流程

#### 分支管理

- main: 生产环境分支
- develop: 开发环境主分支
- feature/\*: 功能分支
- bugfix/\*: 问题修复分支
- release/\*: 发布分支

#### 提交步骤

1. 创建功能分支

```bash
git checkout -b feature/xxx develop  # 从develop创建新分支
```

2. 开发提交代码（重复多次）

```bash
git add .
git commit -m "feat: 实现支付功能"
```

3. 同步最新 develop

```bash
git fetch origin develop           # 获取远端最新代码
git rebase origin/develop          # 变基到最新develop
```

4. 推送到 develop 分支

```bash
git push origin HEAD:develop --force-with-lease  # 强制更新远程develop
```

5. 合并到 main

```bash
git checkout main
git merge origin/develop --ff-only  # 快进合并
git push origin main
```

6. 清理分支

```bash
git branch -d feature/xxx          # 删除本地功能分支
```

### Git 提交规范

```
type(scope): emoji subject

# type: 提交类型
- feat: ✨ 新功能
- fix: 🐛 修复
- docs: 📝 文档
- style: 💄 样式
- refactor: ♻️ 重构
- perf: ⚡️ 性能优化
- test: ✅ 测试
- build: 📦️ 构建
- ci: 🎡 CI配置
- chore: 🔨 其他

# scope: 影响范围
- frontend: 前端相关
- backend: 后端相关
- auth: 认证相关
- api: API相关
- db: 数据库相关

# subject: 简短描述
- 使用中文
- 简洁明了
- 不超过50个字符
```

提交示例:

```bash
git commit -m "feat(auth): ✨ 添加谷歌登录功能"
git commit -m "fix(api): 🐛 修复用户注册接口验证问题"
git commit -m "docs(frontend): 📝 更新组件使用文档"
```

## 5. 开发阶段

### 阶段一: 基础架构 (2-4 周)

- 前后端项目初始化
- 数据库搭建
- API 接口设计

### 阶段二: MVP 开发 (4-8 周)

- TikTok 脚本生成器
- 用户认证(Auth.js)
- 支付集成(Paddle)

### 阶段三: 上线与迭代

- 部署上线
- 收集反馈
- 持续优化

## 6. 商业化定价

### 按次收费

- 基础版: $0.5-1.0/次
- 高级版: $1.0-2.0/次
- 免费试用: 3-5 次/月

### 订阅制

- 基础版: $19/月
- 高级版: $49/月
- 企业版: $99+/月
