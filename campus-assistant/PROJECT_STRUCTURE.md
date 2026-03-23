# 校园智能助手项目结构

## 📁 项目总览
```
campus-assistant/
├── frontend/                 # React 前端应用
├── backend/                  # Node.js 后端 API
├── README.md                 # 项目说明文档
├── start.sh                  # Linux/Mac 启动脚本
├── start.bat                 # Windows 启动脚本
└── docker-compose.yml        # Docker 部署配置
```

## 🎨 前端项目结构（React）

```
frontend/
├── src/
│   ├── components/           # 通用组件（未使用，可扩展）
│   │   └── StaticWrapper.tsx # 路由包装组件（原有）
│   ├── views/               # 页面组件
│   │   ├── Home.tsx         # 首页（今日课程、紧急待办）
│   │   ├── TodoPage.tsx     # 待办事项页面
│   │   ├── SchedulePage.tsx # 课程表页面
│   │   └── ProfilePage.tsx  # 我的页面
│   ├── styles/              # 样式文件
│   │   ├── global.css       # 全局样式（iOS 风格）
│   │   └── Frame*.css       # 原有样式文件（保留）
│   ├── utils/               # 工具函数
│   │   └── api.ts          # API 接口封装
│   ├── types/               # TypeScript 类型
│   │   └── index.ts        # 数据类型定义
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 应用入口
│   └── index.css           # 样式入口
├── public/                  # 静态资源
├── package.json             # 项目依赖
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── index.html              # HTML 模板
```

## 🔧 后端项目结构（Node.js）

```
backend/
├── src/
│   ├── config/              # 配置文件
│   │   └── database.js     # 数据库连接配置
│   ├── controllers/         # 业务控制器
│   │   ├── todoController.js    # 待办逻辑
│   │   ├── courseController.js  # 课程逻辑
│   │   └── reminderController.js # 提醒逻辑
│   ├── middleware/         # 中间件
│   │   ├── auth.js         # JWT 认证中间件
│   │   ├── upload.js       # 文件上传中间件
│   │   └── errorHandler.js # 错误处理中间件
│   ├── models/             # 数据模型
│   │   ├── Todo.js         # 待办模型
│   │   ├── Course.js       # 课程模型
│   │   ├── Reminder.js     # 提醒模型
│   │   └── User.js         # 用户模型
│   ├── routes/             # 路由定义
│   │   ├── todos.js        # 待办路由
│   │   ├── courses.js      # 课程路由
│   │   └── reminders.js   # 提醒路由
│   ├── services/           # 业务服务
│   │   ├── ocrService.js   # OCR 识别服务
│   │   ├── reminderService.js  # 提醒服务
│   │   └── pushNotificationService.js # 推送服务
│   ├── server.js           # 服务器入口
│   └── uploads/            # 文件上传目录（.gitkeep）
├── package.json            # 项目依赖
├── .env.example            # 环境变量示例
└── logs/                  # 日志目录（手动创建）
```

## 🚀 快速启动

### 使用启动脚本（推荐）

#### Windows
```bash
start.bat
```

#### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### 手动启动

1. **启动 MongoDB**
   ```bash
   mongod --fork --logpath ./logs/mongodb.log
   ```

2. **启动后端**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **启动前端**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📱 功能特色

### 前端特性
- 🎨 iOS 风格设计，主色调 #4A90E2
- 📱 响应式布局，支持移动设备
- ✨ 流畅的动画效果（Motion 库）
- 🔍 搜索和筛选功能
- 🎯 待办优先级颜色标记（红/黄/绿）
- 📊 课程表周视图切换
- 📷 OCR 图片上传功能
- 🔔 提醒管理

### 后端特性
- 🔐 JWT 认证和授权
- 📊 MongoDB 数据持久化
- 🔍 Tesseract.js OCR 识别
- ⏰ 定时提醒系统
- 📁 文件上传和存储
- 🔒 安全中间件（CORS、Helmet）
- 📝 详细的错误处理
- 📈 API 响应标准化

## 🎯 核心页面

### 1. 首页
- 显示今日日期和问候语
- 今日课程卡片展示
- 紧急待办提醒
- 快速操作按钮（添加待办、查看课程表）

### 2. 待办事项
- 进行中/已完成标签切换
- 搜索功能
- 优先级颜色标记
- 添加/编辑/删除待办
- 重复周期设置

### 3. 课程表
- 周视图切换
- 日期选择器
- 课程色块展示
- 课程详情查看
- OCR 图片导入功能

### 4. 我的页面
- 用户信息展示
- 学习统计数据
- 功能菜单（个人信息、设置、提醒等）

## 🔧 开发配置

### 环境变量（backend/.env）
```env
MONGODB_URI=mongodb://localhost:27017/campus-assistant
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 开发工具
- VS Code + ESLint + Prettier
- Chrome DevTools（调试）
- Postman（API 测试）
- MongoDB Compass（数据库管理）

## 📦 部署说明

### 生产环境
1. 配置环境变量
2. 构建前端代码
3. 启动后端服务
4. 配置 Nginx 反向代理
5. 设置 SSL 证书

### Docker 部署
```bash
docker-compose up -d
```

### PM2 进程管理
```bash
npm install pm2 -g
pm2 start backend/src/server.js --name "campus-assistant-backend"
pm2 start "npm run build && npm start" --name "campus-assistant-frontend"
```

## 🔄 数据同步

前端通过 Axios 调用后端 API，实现数据的实时同步：

1. **待办数据**：前端 ↔ 后端 ↔ MongoDB
2. **课程数据**：前端 ↔ 后端 ↔ MongoDB
3. **提醒数据**：后端定时检查 → 触发推送通知

## 📝 后续优化建议

1. **用户系统**：实现注册/登录功能
2. **数据同步**：加入离线缓存机制
3. **推送通知**：集成 FCM/极光推送
4. **数据导出**：Excel/CSV 导出功能
5. **主题切换**：深色/浅色模式
6. **多语言**：国际化支持
7. **数据备份**：自动备份功能
8. **统计分析**：更详细的学习数据报告