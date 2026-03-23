@echo off
echo 🚀 启动校园智能助手...

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)

REM 检查 MongoDB
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB 未安装，请先安装 MongoDB
    pause
    exit /b 1
)

REM 检查端口占用
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口 3000 已被占用
    set /p choice="是否继续？(y/N) "
    if /i not "%choice%"=="y" (
        exit /b 1
    )
)

netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口 5000 已被占用
    set /p choice="是否继续？(y/N) "
    if /i not "%choice%"=="y" (
        exit /b 1
    )
)

REM 启动 MongoDB
echo 📚 启动 MongoDB...
mongod --fork --logpath .\logs\mongodb.log >nul 2>&1 || (
    echo MongoDB 可能已经在运行
)

REM 创建日志目录
if not exist "logs" mkdir logs

REM 启动后端
echo 🔧 启动后端服务器...
cd backend
call npm install
call npm start
BACKEND_PID=%errorlevel%

REM 启动前端
echo 🎨 启动前端开发服务器...
cd ..\frontend
call npm install
call npm run dev
FRONTEND_PID=%errorlevel%

echo ✅ 启动成功！
echo 📱 前端地址: http://localhost:3000
echo 🔌 后端地址: http://localhost:5000

echo 按任意键停止服务...
pause >nul

REM 清理进程
echo 🔄 正在停止服务...
taskkill /FI "WINDOWTITLE eq *" /F >nul 2>&1

echo 👋 再见！
pause