@echo off
chcp 65001 >nul

echo 🔍 环境检查工具
echo =================

echo.
echo 检查 Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装
) else (
    echo ✅ Node.js 已安装
)

echo.
echo 检查 npm...
npm --version
if %errorlevel% neq 0 (
    echo ❌ npm 未安装
) else (
    echo ✅ npm 已安装
)

echo.
echo 检查 MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB 未安装
    echo.
    echo MongoDB 安装说明：
    echo 1. 下载地址: https://www.mongodb.com/try/download/community
    echo 2. 选择 MSI 安装程序
    echo 3. 安装时选择 "Install MongoDB as a Service"
    echo 4. 重启电脑
) else (
    echo ✅ MongoDB 已安装
)

echo.
echo 检查目录结构...
if exist "frontend\package.json" (
    echo ✅ 前端项目存在
) else (
    echo ❌ 前端项目不存在
)

if exist "backend\package.json" (
    echo ✅ 后端项目存在
) else (
    echo ❌ 后端项目不存在
)

echo.
echo 检查端口占用...
netstat -ano | findstr :3000
if %errorlevel% equ 0 (
    echo ⚠️  端口 3000 被占用
) else (
    echo ✅ 端口 3000 可用
)

netstat -ano | findstr :5000
if %errorlevel% equ 0 (
    echo ⚠️  端口 5000 被占用
) else (
    echo ✅ 端口 5000 可用
)

echo.
pause