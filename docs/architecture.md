# NicheFlow 前端架构设计文档

## 1. 项目概述

NicheFlow 是一个 AI 驱动的垂直平台内容创作助手，主要面向 TikTok 博主、独立站卖家和短视频创作者。本文档详细说明前端架构设计。

### 1.1 核心功能
- TikTok 脚本生成器（MVP）
- 亚马逊文案生成（计划中）
- YouTube 内容生成（计划中）
- 视频/音频生成（计划中）

### 1.2 技术栈
- Next.js 15 + Turbopack
- React 18 + TypeScript
- Zustand（客户端状态）
- TanStack Query（服务端状态）
- Ant Design + Tailwind CSS
- next-i18next（国际化）

## 2. 目录结构

```
src/
  ├── app/                    # App Router目录
  │   ├── (auth)/            # 认证相关路由组
  │   │   ├── login/         # 登录页面
  │   │   ├── register/      # 注册页面
  │   │   └── callback/      # OAuth回调页面
  │   ├── (dashboard)/       # 主面板路由组
  │   │   ├── layout.tsx     # 仪表盘布局
  │   │   ├── page.tsx       # 首页/工作台
  │   │   ├── projects/      # 项目管理
  │   │   ├── templates/     # 模板中心
  │   │   └── settings/      # 用户设置
  │   └── (marketing)/       # 营销页面路由组
  │       ├── layout.tsx     # 营销页面布局
  │       ├── page.tsx       # 首页
  │       ├── pricing/       # 定价页面
  │       └── about/         # 关于我们
  ├── components/            # 组件目录
  │   ├── ui/               # 基础UI组件
  │   ├── layout/           # 布局组件
  │   ├── features/         # 功能组件
  │   └── shared/           # 共享组件
  └── lib/                  # 工具库
```

## 3. 页面布局设计

### 3.1 营销首页 (/)
```
Layout:
├── Header
│   ├── Logo
│   ├── 主导航 (Features, Pricing, About)
│   └── 登录/注册按钮
├── Hero区域
│   ├── 主标题
│   ├── 副标题
│   ├── CTA按钮
│   └── 演示视频/动画
├── 功能展示区
│   ├── TikTok脚本生成
│   ├── 亚马逊文案生成（即将推出）
│   ├── YouTube内容生成（即将推出）
│   └── 视频/音频生成（即将推出）
├── 定价方案
└── Footer
```

### 3.2 工作台 (/dashboard)
```
Layout:
├── 侧边栏导航
│   ├── 工作台
│   ├── 我的项目
│   ├── 模板中心
│   └── 设置
├── 顶部栏
│   ├── 搜索栏
│   ├── 通知中心
│   └── 用户菜单
└── 主内容区
    ├── 快速启动区
    │   ├── TikTok脚本生成
    │   ├── 亚马逊文案（即将推出）
    │   ├── YouTube内容（即将推出）
    │   └── 视频/音频（即将推出）
    ├── 最近项目
    └── 使用统计
```

### 3.3 内容生成器页面
```
Layout:
├── 左侧边栏
│   ├── 模板选择
│   └── 历史记录
├── 主内容区
│   ├── 输入区域
│   │   ├── 产品/内容信息
│   │   ├── 目标受众
│   │   └── 风格选择
│   ├── 生成按钮
│   └── 结果展示区
└── 右侧边栏
    ├── AI参数调整
    ├── 保存/导出
    └── 分享按钮
```

## 4. 组件设计

### 4.1 核心功能组件
```
components/
  ├── features/
  │   ├── tiktok/
  │   │   ├── ScriptGenerator.tsx
  │   │   ├── ScriptTemplate.tsx
  │   │   └── ScriptPreview.tsx
  │   ├── amazon/
  │   │   └── CopyGenerator.tsx
  │   ├── youtube/
  │   │   └── ContentGenerator.tsx
  │   └── media/
  │       ├── VideoGenerator.tsx
  │       └── AudioGenerator.tsx
  └── shared/
      ├── AIControls.tsx
      ├── PromptEditor.tsx
      └── OutputDisplay.tsx
```

## 5. 状态管理设计

### 5.1 Zustand Store 结构
```typescript
store/
├── auth.ts          // 认证状态
├── editor.ts        // 编辑器状态
├── generation.ts    // 生成状态
└── ui.ts           // UI状态
```

### 5.2 TanStack Query 使用
- API 请求缓存
- 服务端状态同步
- 乐观更新
- 错误处理

## 6. 主题和样式设计

### 6.1 颜色系统
```typescript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... 其他色阶
    900: '#0c4a6e',
  },
  secondary: {
    // 次要颜色
  },
  accent: {
    // 强调色
  }
}
```

### 6.2 响应式设计
```typescript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

## 7. 开发计划

### 7.1 第一阶段：基础架构（当前）
- [x] 创建项目文档
- [ ] 搭建基础布局
- [ ] 实现认证系统
- [ ] 完成工作台框架

### 7.2 第二阶段：核心功能
- [ ] TikTok 脚本生成器
- [ ] 用户项目管理
- [ ] 模板系统

### 7.3 第三阶段：功能扩展
- [ ] 亚马逊文案生成
- [ ] YouTube 内容生成
- [ ] 媒体生成功能

## 8. 性能优化策略

### 8.1 加载优化
- 路由分组
- 组件懒加载
- 图片优化

### 8.2 渲染优化
- 虚拟列表
- 组件记忆化
- 状态本地化

## 9. 安全考虑

### 9.1 认证安全
- OAuth 2.0 集成
- Token 管理
- CSRF 防护

### 9.2 数据安全
- 敏感信息加密
- API 请求签名
- 输入验证