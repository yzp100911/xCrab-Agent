# skillgate-agent 🦀

基于 MiniMax-M2.7 的智能 AI 助手套件，包含 **xCrab (AI执行引擎)**、**eclaw (服务分发器)**、**cclaw (远程分发器)** 和 **wclaw (Web客户端)** 四大核心组件。

一套仓库，完整部署。

---

## 📦 系统架构

```
skillgate-agent/
├── deploy.sh              # 一键部署脚本
├── README.md              # 中文文档（当前文件）
├── README_EN.md           # 英文文档
├── .env.example           # 根环境变量模板
├── LICENSE                # MIT 许可证
├── xCrab/                 # AI 执行引擎（核心）
│   ├── README.md          # xCrab 详细文档
│   ├── index.js           # 主入口
│   ├── src/               # 核心源码
│   ├── skills/            # 技能模块
│   ├── eclaw/             # 服务分发器
│   ├── cclaw/             # 远程分发器
│   └── wclaw/             # Web 客户端
```

## 功能特性

- 🤖 **AI 对话** - 基于 MiniMax-M2.7 模型
- 🦀 **技能系统** - 支持动态加载各种技能（浏览器自动化、翻译等）
- 💾 **记忆系统** - 支持对话历史存储和检索
- 🔐 **Gateway 认证** - 支持 Token 认证保护
- 🌐 **浏览器自动化** - 可选支持 Playwright 浏览器控制
- 📡 **多模块架构** - 集成 xCrab、eclaw、cclaw、wclaw 四大模块

## 快速部署

### 方式一：一键部署（推荐）

```bash
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent
chmod +x deploy.sh
./deploy.sh
```

### 方式二：手动部署

```bash
# 1. 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 PM2
npm install -g pm2

# 3. 克隆项目
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent/xCrab

# 4. 安装依赖
npm install

# 5. 配置环境变量
cp .env.example .env
# 编辑 .env，填入 MINIMAX_API_KEY 和 AUTH_TOKEN

# 6. 启动服务
chmod +x start.sh
./start.sh

# 7. 验证
curl http://localhost:60016/health
```

## 环境要求

- Node.js >= 18.0.0
- PM2（进程管理器）
- Git

## 详细文档

各模块的详细部署和使用说明请参考对应目录下的 README：

| 模块 | 说明 | 文档 |
|------|------|------|
| xCrab | AI 执行引擎（核心） | [xCrab/README.md](xCrab/README.md) |
| xCrab (EN) | AI Execution Engine | [xCrab/README_EN.md](xCrab/README_EN.md) |

## 配置说明

编辑 `xCrab/.env` 文件：

```bash
# 必填
AUTH_TOKEN=your_secure_token_here
MINIMAX_API_KEY=your_api_key_here

# 可选（已有默认值）
MINIMAX_BASE_URL=https://api.minimaxi.com/v1
MINIMAX_MODEL=MiniMax-M2.7
PORT=60016
ENABLE_MEMORY=true
GATEWAY_ENABLED=true
GATEWAY_TOKEN=your_gateway_token_here
```

## 服务管理

```bash
pm2 status xcrab       # 查看状态
pm2 logs xcrab         # 查看日志
pm2 restart xcrab      # 重启
pm2 stop xcrab         # 停止
pm2 delete xcrab       # 删除进程
```

## API 使用

```bash
curl -X POST http://localhost:60016/api/chat \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"你好，请介绍一下自己"}'
```

## 健康检查

```bash
curl http://localhost:60016/health
# {"status":"ok","timestamp":"...","uptime":...}
```

## 许可证

本项目采用 [MIT 许可证](LICENSE) 开源。

---

<p align="center">
  <strong>skillgate-agent</strong> — 让 AI 助手触手可及 🦀
</p>
