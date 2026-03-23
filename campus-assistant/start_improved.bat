@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 启动校园智能助手...
echo ======================================

REM 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装
    echo.
    echo 请先安装 Node.js：
    echo 1. 访问 https://nodejs.org/
    echo 2. 下载并安装 LTS 版本
    echo 3. 重启命令行后再试
    pause
    exit /b 1
)

REM 检查 MongoDB
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB 未找到
    echo.
    echo 请先安装 MongoDB：
    echo 1. 访问 https://www.mongodb.com/try/download/community
    echo 2. 下载并安装 MongoDB
    echo 3. 或者使用 MongoDB Atlas 云数据库
    echo.
    set /p choice="是否跳过 MongoDB 继续？(y/N) "
    if /i not "!choice!"=="y" (
        exit /b 1
    )
)

REM 创建必要的目录
if not exist "logs" mkdir logs
if not exist "backend/uploads" mkdir "backend/uploads"

REM 检查端口
echo 📡 检查端口占用...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口 3000 已被占用
    set /p choice="是否继续？(y/N) "
    if /i not "!choice!"=="y" exit /b 1
)

netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口 5000 已被占用
    set /p choice="是否继续？(y/N) "
    if /i not "!choice!"=="y" exit /b 1
)

REM 启动 MongoDB（如果可用）
echo 📚 尝试启动 MongoDB...
mongod --fork --logpath .\logs\mongodb.log 2>nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB 启动成功
) else (
    echo ℹ️  MongoDB 可能已在运行或未安装
)

REM 安装后端依赖
echo 🔧 安装后端依赖...
cd backend
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 后端依赖安装失败
        cd ..
        pause
        exit /b 1
    )
)

echo ✅ 后端依赖安装完成

REM 启动后端（在新的窗口中）
echo 🌐 启动后端服务器...
start "Campus Assistant Backend" cmd /k "npm start"

REM 等待后端启动
timeout /t 5 /nobreak >nul

REM 安装前端依赖
echo 🎨 安装前端依赖...
cd ..\frontend
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 前端依赖安装失败
        cd ..
        pause
        exit /b 1
    )
)

echo ✅ 前端依赖安装完成

REM 启动前端（在新的窗口中）
echo 🚀 启动前端开发服务器...
start "Campus Assistant Frontend" cmd /k "npm run dev"

echo.
echo ✅ 启动成功！
echo ======================================
echo 📱 前端地址: http://localhost:3000
echo 🔌 后端地址: http://localhost:5000
echo.
echo 按任意键打开浏览器...
pause >nul

REM 打开浏览器
start http://localhost:3000

echo 👋 按任意键退出...
pause >nul