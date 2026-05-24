#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "🦀 skillgate-agent 一键部署脚本"
echo "================================"
echo "📂 部署目录: $SCRIPT_DIR"

# 检测是否已安装 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，正在安装..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

echo "✅ Node.js: $(node -v)"

# 检测是否已安装 PM2
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 未安装，正在安装..."
    npm install -g pm2
fi

echo "✅ PM2: $(pm2 -v)"

# 进入 xCrab 目录
cd "$SCRIPT_DIR/xCrab"

# 安装依赖
if [ ! -d node_modules ]; then
    echo "📦 安装依赖..."
    npm install
else
    echo "📦 依赖已安装，跳过"
fi

# 配置环境变量
if [ ! -f .env ]; then
    echo "📝 创建环境变量配置文件..."
    cp .env.example .env
    echo ""
    echo "⚠️  请先编辑 .env 文件，填入以下必填项："
    echo "   - MINIMAX_API_KEY: 你的 MiniMax API Key"
    echo "   - AUTH_TOKEN: 设置一个安全访问令牌"
    echo ""
    echo "   编辑完成后再运行: ./deploy.sh"
    exit 1
fi

# 验证必要配置
if grep -q "your_minimax_api_key_here\|your_auth_token_here" .env 2>/dev/null; then
    echo "⚠️  .env 文件仍包含默认值，请编辑后重试"
    echo "   必填: MINIMAX_API_KEY 和 AUTH_TOKEN"
    exit 1
fi

# 停止旧进程
echo "🛑 停止旧进程..."
pm2 stop xcrab 2>/dev/null || true
pm2 delete xcrab 2>/dev/null || true

# 启动服务
echo "🚀 启动服务..."
export NODE_ENV=production
pm2 start ecosystem.config.cjs --env production
pm2 save

# 等待服务启动
sleep 2

# 健康检查
echo ""
echo "🔍 执行健康检查..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:60016/health 2>/dev/null || echo "000")
if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ 健康检查通过！服务运行正常"
else
    echo "⚠️  健康检查返回状态码: $HEALTH_CHECK"
    echo "   请检查: pm2 logs xcrab"
fi

# 显示状态
echo ""
echo "================================"
echo "✅ 部署完成！"
echo "================================"
pm2 status xcrab
echo ""
echo "📝 查看日志: pm2 logs xcrab"
echo "🌐 访问地址: http://localhost:60016"
echo "🔍 健康检查: http://localhost:60016/health"
