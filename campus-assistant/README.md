# 校园智能助手

一个基于 React + Node.js 的校园智能助手应用，提供待办事项管理、课程表管理和提醒功能。

## 功能特性

### 前端功能
- 📱 iOS 风格界面设计
- ✅ 待办事项管理（增删改查、优先级、重复设置）
- 📅 智能课程表（周视图、课程详情、OCR导入）
- 🔔 提醒系统（课程和待办提醒）
- 👤 个人中心
- 🎨 极简设计风格

### 后端功能
- 🚀 Express REST API
- 📊 MongoDB 数据存储
- 🔍 OCR 课程表识别（Tesseract.js）
- ⏰ 定时提醒系统
- 🔒 JWT 认证
- 📁 文件上传支持

## 技术栈

### 前端
- React 19
- TypeScript
- Vite
- React Router
- Axios
- Motion (动画)
- Date-fns (日期处理)
- Tailwind CSS

### 后端
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Multer
- Tesseract.js
- Node-schedule

## 项目结构

```
campus-assistant/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/      # 通用组件
│   │   ├── views/          # 页面组件
│   │   ├── styles/         # 样式文件
│   │   ├── utils/          # 工具函数
│   │   └── types/          # TypeScript 类型定义
│   ├── public/
│   └── package.json
└── backend/                 # Node.js 后端
    ├── src/
    │   ├── config/         # 配置文件
    │   ├── controllers/    # 控制器
    │   ├── middleware/      # 中间件
    │   ├── models/         # 数据模型
    │   ├── routes/         # 路由定义
    │   ├── services/       # 业务服务
    │   └── server.js      # 服务器入口
    ├── uploads/            # 文件上传目录
    └── package.json
```

## 安装和运行

### 前端安装和运行

1. 进入前端目录
```bash
cd frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

前端将在 http://localhost:3000 运行

### 后端安装和运行

1. 确保已安装 Node.js 和 MongoDB

2. 进入后端目录
```bash
cd backend
```

3. 安装依赖
```bash
npm install
```

4. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

5. 启动服务器
```bash
npm run dev
```

后端将在 http://localhost:5000 运行

## API 接口文档

### 待办事项

- `GET /api/todos` - 获取所有待办
- `POST /api/todos` - 创建新待办
- `PUT /api/todos/:id` - 更新待办
- `DELETE /api/todos/:id` - 删除待办
- `PATCH /api/todos/:id` - 切换完成状态

### 课程管理

- `GET /api/courses` - 获取所有课程
- `POST /api/courses` - 创建课程
- `PUT /api/courses/:id` - 更新课程
- `DELETE /api/courses/:id` - 删除课程
- `POST /api/courses/ocr` - OCR 导入课程表

### 提醒系统

- `GET /api/reminders` - 获取所有提醒
- `POST /api/reminders` - 创建提醒
- `PUT /api/reminders/:id` - 更新提醒
- `DELETE /api/reminders/:id` - 删除提醒

## 数据模型

### Todo (待办)
```javascript
{
  id: ObjectId,
  title: String,
  description: String,
  priority: 'high' | 'medium' | 'low',
  time: Date,
  completed: Boolean,
  repeat: 'daily' | 'weekly' | 'monthly' | 'none',
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Course (课程)
```javascript
{
  id: ObjectId,
  name: String,
  teacher: String,
  room: String,
  startTime: String,
  endTime: String,
  weekDay: Number, // 1-7
  weekRange: String,
  color: String,
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Reminder (提醒)
```javascript
{
  id: ObjectId,
  title: String,
  content: String,
  time: String,
  type: 'todo' | 'course',
  relatedId: ObjectId,
  enabled: Boolean,
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 开发说明

### 环境要求
- Node.js 16+
- MongoDB 4.4+
- npm 或 yarn

### OCR 功能
OCR 功能使用 Tesseract.js 实现，支持中英文识别。在实际使用中，可能需要根据具体的课程表格式调整解析逻辑。

### 推送通知
当前使用模拟的推送服务，实际部署时可以集成：
- Firebase Cloud Messaging (FCM)
- 极光推送
- 个推
- 其他第三方推送服务

### 部署建议
1. 使用 PM2 进行进程管理
2. 配置 Nginx 反向代理
3. 设置 MongoDB 副本集
4. 配置 HTTPS
5. 设置定时任务清理过期数据

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。