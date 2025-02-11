# NicheFlow 开发日志

## 2024-02-19

### 项目初始化

#### 1. 基础结构搭建

- ✅ 创建项目基础目录结构
  - `frontend/`: 前端项目目录
  - `backend/`: 后端项目目录
  - `docs/`: 项目文档目录
- ✅ 创建基础配置文件
  - `README.md`: 项目说明文档
  - `LICENSE`: MIT 许可证
  - `.gitignore`: Git 忽略配置
  - `package.json`: 项目配置文件

#### 2. Git 仓库初始化

- ✅ 初始化 Git 仓库
- ✅ 创建主要分支
  - `main`: 生产环境分支
  - `develop`: 开发环境主分支
- ✅ 配置 Git 提交规范
  - 使用 commitizen 规范提交信息
  - 配置 commitlint 检查提交信息
  - 添加 husky 进行 Git hooks 管理

#### 3. 前端项目初始化

- ✅ 使用 create-next-app 创建 Next.js 项目
  - 启用 Turbopack 以提升开发体验
  - 配置 TypeScript 支持
  - 集成 Tailwind CSS
  - 启用 ESLint
  - 使用 App Router
  - 配置 src 目录结构
  - 设置 `@/*` 导入别名
- ✅ 添加核心依赖
  - Zustand: 客户端状态管理
  - TanStack Query: 服务端状态管理
  - Ant Design + Icons: UI 组件库
  - react-intl: 国际化支持
- ✅ 添加开发依赖
  - TypeScript ESLint 插件
  - Prettier 代码格式化
  - SASS 支持
- ✅ 配置代码规范
  - 配置 ESLint 规则
    - 继承 Next.js 推荐配置
    - 启用 TypeScript ESLint 规则
    - 集成 Prettier 配置
  - 配置 Prettier 格式化规则
    - 使用单引号
    - 不使用分号
    - 设置最大行宽为 100
    - 统一使用 LF 换行
  - 更新 .gitignore 配置
    - 完善前端忽略规则
    - 添加后端相关忽略
    - 补充系统和临时文件忽略
- ✅ 配置国际化支持
  - 集成 react-intl
  - 配置中英文语言文件
  - 实现基于浏览器语言的自动切换
  - 添加语言切换下拉菜单
- ✅ 配置 Ant Design 主题
  - 自定义品牌色系
  - 统一组件圆角
  - 配置字体系统
  - 设置组件默认样式
- ✅ 配置环境管理
  - 使用 dotenv-cli 管理多环境
  - 配置开发环境变量
  - 添加环境相关脚本
  - 规范环境变量命名

### 待办事项

#### 前端

- [x] 配置 ESLint 和 Prettier
- [x] 设置国际化支持
- [x] 配置 Ant Design 主题
- [x] 配置环境管理
- [x] 搭建基础页面结构
  - [x] 实现布局组件
  - [x] 创建导航组件
  - [x] 设计首页
  - [x] 添加错误页面
- [x] 实现状态管理架构
  - [x] 用户认证状态
  - [x] 主题偏好设置
  - [x] API 请求缓存
  - [x] 全局加载状态

#### 后端

- [ ] 初始化 Go 项目
- [ ] 配置开发环境
- [ ] 设置数据库连接
- [ ] 实现基础 API 结构

### 技术选型说明

#### 状态管理方案

选择 Zustand + TanStack Query 的组合方案：

- Zustand 负责客户端状态
  - 轻量级，bundle size 小
  - 简单易用，学习成本低
  - 基于 hooks，符合 React 最新实践
  - 优秀的 TypeScript 支持
- TanStack Query 负责服务端状态
  - 强大的缓存管理
  - 自动重试和错误处理
  - 乐观更新支持
  - 完善的开发者工具

#### 构建工具

选择 Turbopack：

- 比 Webpack 更快的开发体验
- 与 Next.js 深度集成
- 虽处于 Beta 阶段，但在开发环境使用风险可控
