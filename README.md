# skillgate-agent 🦀

基于 MiniMax-M2.7 的智能 AI 助手，支持技能扩展、记忆系统和 Gateway 认证。

## 功能特性

- 🤖 **AI 对话** - 基于 MiniMax-M2.7 模型
- 🦀 **技能系统** - 支持动态加载各种技能（如浏览器自动化、翻译等）
- 💾 **记忆系统** - 支持对话历史存储和检索
- 🔐 **Gateway 认证** - 支持 Token 认证保护
- 🌐 **浏览器自动化** - 可选支持 Playwright 浏览器控制

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
# 1. 克隆仓库
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent

# 2. 进入 xCrab 目录
cd xCrab

# 3. 安装依赖
npm install

# 4. 配置环境变量
cp .env.example .env
nano .env  # 编辑填入 AUTH_TOKEN 和 MINIMAX_API_KEY

# 5. 启动服务
chmod +x start.sh
./start.sh

# 6. 验证服务
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" \\
     http://localhost:60016/api/chat \\
     -d '{"message":"你好"}'
```

## 环境要求

- Node.js 18+
- PM2 (进程管理器)
- Git

## 配置说明

编辑 `.env` 文件：

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

## API 使用

### 聊天接口

```bash
curl -X POST http://localhost:60016/api/chat \\
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"你好，请介绍一下你自己"}'
```

### 响应格式

```json
{
  "code": 200,
  "data": {
    "content": "你好！我是 xCrab...",
    "sessionId": "xxx-xxx-xxx"
  }
}
```

## PM2 管理命令

```bash
pm2 status xcrab       # 查看状态
pm2 logs xcrab         # 查看日志
pm2 restart xcrab      # 重启
pm2 stop xcrab         # 停止
pm2 delete xcrab       # 删除进程
```

## 目录结构

```
skillgate-agent/
├── xCrab/
│   ├── src/
│   │   ├── index.js          # 主入口
│   │   ├── api.js            # API 路由
│   │   ├── bot.js            # Bot 逻辑
│   │   ├── memory/           # 记忆系统
│   │   │   └── store.js      # 存储模块
│   │   └── skills/           # 技能目录
│   ├── .env.example         # 环境变量模板
│   ├── package.json
│   ├── start.sh             # 启动脚本
│   └── ecosystem.config.js  # PM2 配置
├── deploy.sh                # 一键部署脚本
├── README.md
└── .gitignore
```

## 常见问题

### 1. 启动失败

检查日志：`pm2 logs xcrab`

常见原因：
- 端口被占用：修改 `.env` 中的 `PORT`
- API Key 无效：检查 `MINIMAX_API_KEY`
- 依赖未安装：运行 `npm install`

### 2. 无法访问 API

确认：
- 防火墙开放了端口（默认 60016）
- 使用正确的 Token：`Authorization: Bearer YOUR_AUTH_TOKEN`

### 3. 记忆系统不工作

确认 `.env` 中 `ENABLE_MEMORY=true`

## 许可证

MIT
