# PowerShell 启动脚本
Write-Host "🚀 启动校园智能助手..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 检查 Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js 未安装" -ForegroundColor Red
    Write-Host "`n请先安装 Node.js："
    Write-Host "1. 访问 https://nodejs.org/"
    Write-Host "2. 下载并安装 LTS 版本"
    Write-Host "3. 重启 PowerShell 后再试"
    Read-Host "`n按任意键退出"
    exit 1
}

Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green

# 检查 MongoDB
$mongodVersion = mongod --version 2>$null
if (-not $mongodVersion) {
    Write-Host "⚠️  MongoDB 未找到" -ForegroundColor Yellow
    Write-Host "`n请先安装 MongoDB："
    Write-Host "1. 访问 https://www.mongodb.com/try/download/community"
    Write-Host "2. 下载并安装 MongoDB"
    Write-Host "3. 或者使用 MongoDB Atlas 云数据库"
    $choice = Read-Host "`n是否跳过 MongoDB 继续？(y/N)"
    if ($choice -ne "y" -and $choice -ne "Y") {
        exit 1
    }
}

# 创建目录
if (-not (Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" | Out-Null }
if (-not (Test-Path "backend/uploads")) { New-Item -ItemType Directory -Path "backend/uploads" | Out-Null }

# 检查端口
$port3000 = netstat -ano | Select-String ":3000"
$port5000 = netstat -ano | Select-String ":5000"

if ($port3000) {
    Write-Host "⚠️  端口 3000 已被占用" -ForegroundColor Yellow
    $choice = Read-Host "是否继续？(y/N)"
    if ($choice -ne "y" -and $choice -ne "Y") { exit 1 }
}

if ($port5000) {
    Write-Host "⚠️  端口 5000 已被占用" -ForegroundColor Yellow
    $choice = Read-Host "是否继续？(y/N)"
    if ($choice -ne "y" -and $choice -ne "Y") { exit 1 }
}

# 安装依赖
Write-Host "`n🔧 安装依赖..." -ForegroundColor Yellow

# 后端
Set-Location backend
if (-not (Test-Path "node_modules")) {
    Write-Host "安装后端依赖..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 后端依赖安装失败" -ForegroundColor Red
        Set-Location ..
        Read-Host "`n按任意键退出"
        exit 1
    }
}

# 启动后端
Write-Host "启动后端服务器..." -ForegroundColor Green
Start-Process "cmd" -ArgumentList "/k npm start" -NoNewWindow
Start-Sleep -Seconds 5

# 前端
Set-Location ..\frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "安装前端依赖..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 前端依赖安装失败" -ForegroundColor Red
        Set-Location ..
        Read-Host "`n按任意键退出"
        exit 1
    }
}

# 启动前端
Write-Host "启动前端开发服务器..." -ForegroundColor Green
Start-Process "cmd" -ArgumentList "/k npm run dev" -NoNewWindow

Set-Location ..

# 完成
Write-Host "`n✅ 启动成功！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "📱 前端地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 后端地址: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`n按任意键打开浏览器..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 打开浏览器
Start-Process "http://localhost:3000"

Write-Host "👋 按任意键退出..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")