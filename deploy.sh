#!/bin/bash
set -e

echo "🦀 skillgate-agent 一键部署脚本"
echo "================================"

# 检测是否已安装 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，正在安装..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# 检测是否已安装 PM2
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 未安装，正在安装..."
    npm install -g pm2
fi

# 进入目录
cd /root/skillgate-agent/xCrab

# 安装依赖
echo "📦 安装依赖..."
npm install

# 配置环境变量
if [ ! -f .env ]; then
    echo "📝 创建环境变量配置文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件配置 AUTH_TOKEN 和 MINIMAX_API_KEY"
fi

# 停止旧进程
echo "🛑 停止旧进程..."
pm2 stop xcrab 2>/dev/null || true
pm2 delete xcrab 2>/dev/null || true

# 启动服务
echo "🚀 启动服务..."
chmod +x start.sh
./start.sh

# 保存进程列表
echo "💾 保存进程列表..."
pm2 save

# 显示状态
echo ""
echo "================================"
echo "✅ 部署完成！"
echo "================================"
pm2 status xcrab
echo ""
echo "🌐 访问地址: http://localhost:60016"
echo "📝 查看日志: pm2 logs xcrab"
