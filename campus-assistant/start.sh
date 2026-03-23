#!/bin/bash

echo "🚀 启动校园智能助手..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 MongoDB
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB 未安装，请先安装 MongoDB"
    exit 1
fi

# 检查端口占用
FRONTEND_PORT=3000
BACKEND_PORT=5000

if lsof -Pi :$FRONTEND_PORT -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  端口 $FRONTEND_PORT 已被占用"
    read -p "是否继续？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  端口 $BACKEND_PORT 已被占用"
    read -p "是否继续？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 启动 MongoDB
echo "📚 启动 MongoDB..."
mongod --fork --logpath ./logs/mongodb.log 2>/dev/null || {
    echo "MongoDB 可能已经在运行"
}

# 启动后端
echo "🔧 启动后端服务器..."
cd backend
npm install
npm start &
BACKEND_PID=$!

# 启动前端
echo "🎨 启动前端开发服务器..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ 启动成功！"
echo "📱 前端地址: http://localhost:$FRONTEND_PORT"
echo "🔌 后端地址: http://localhost:$BACKEND_PORT"

# 等待用户输入
echo "按 Ctrl+C 停止服务..."
read -n 1 -s

# 清理进程
echo "🔄 正在停止服务..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
pkill -f "mongod" 2>/dev/null

echo "👋 再见！"