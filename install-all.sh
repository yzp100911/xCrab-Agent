#!/bin/bash
# ══════════════════════════════════════════════
# xCrab 全家桶 — 一键安装脚本
# 安装 xCrab-Agent + eclaw-server + claw-client
# ══════════════════════════════════════════════

set -e

echo "🦀 xCrab 全家桶安装中..."
echo ""

# 1. 安装 xCrab-Agent 依赖
echo "━━━ [1/3] 安装 🧠 xCrab-Agent 依赖 ━━━"
cd "$(dirname "$0")"
npm install
echo "✅ xCrab-Agent 完成"
echo ""

# 2. 安装 eclaw-server 依赖
echo "━━━ [2/3] 安装 📡 eclaw-server 依赖 ━━━"
cd eclaw
npm install
cd ..
echo "✅ eclaw-server 完成"
echo ""

# 3. 安装 claw-client 依赖
echo "━━━ [3/3] 安装 🤖 claw-client 依赖 ━━━"
cd cclaw
npm install
cd ..
echo "✅ claw-client 完成"
echo ""

echo "═══════════════════════════════════════"
echo "🎉 xCrab 全家桶安装完成！"
echo ""
echo "接下来："
echo "  1. cp .env.example .env  # 配置环境变量"
echo "  2. 按需启动各组件："
echo "     - 🧠 AI:     node index.js"
echo "     - 📡 中转:   node eclaw/server.js"
echo "     - 🤖 执行:   node cclaw/index.js"
echo "═══════════════════════════════════════"
