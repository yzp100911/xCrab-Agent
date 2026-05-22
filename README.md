[🇨🇳 中文] | [🇬🇧 English](README_EN.md)

# xCrab-Agent 🦀

**xCrab** — AI 个人助手全家桶，集成了 AI 对话引擎（xCrab-Agent）、中转调度服务器（eclaw-server）和远程执行终端（claw-client）。**下载一个仓库，即可完整部署。**

---

## 📦 系统架构

```
┌──────────────────────────────────────────────────────────┐
│                   xCrab-Agent (本仓库)                    │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────┐            │
│  │  📡 eclaw-server  │    │  🧠 xCrab-Agent  │            │
│  │  中转调度服务器    │◄──►│  AI 对话引擎      │            │
│  │  用户登录/注册    │    │  MiniMax/DeepSeek │            │
│  │  消息转发(WS)     │    │  工具调用          │            │
│  │  文件上传服务     │    │  技能扩展          │            │
│  │  网页前端(wclaw)  │    │  持久化记忆        │            │
│  └────────┬─────────┘    └──────────────────┘            │
│           │                                               │
│           ▼                                               │
│  ┌──────────────────┐                                    │
│  │  🤖 claw-client   │                                    │
│  │  远程执行终端     │                                    │
│  │  WebSocket 连接   │                                    │
│  │  node-pty 终端    │                                    │
│  │  服务器命令执行   │                                    │
│  └──────────────────┘                                    │
└──────────────────────────────────────────────────────────┘
```

| 组件 | 路径 | 说明 |
|------|------|------|
| 🧠 **xCrab-Agent** | 根目录 `./` | AI 对话引擎，对接 MiniMax/DeepSeek，支持工具调用和技能扩展 |
| 📡 **eclaw-server** | [`./eclaw/`](./eclaw) | 中转调度服务器，管理 WebSocket 连接、用户登录、文件服务、网页前端 |
| 🤖 **claw-client** | [`./cclaw/`](./cclaw) | 远程执行终端，通过 WebSocket 连接 eclaw，在目标服务器上执行命令 |

---

## 🚀 快速开始

### 📋 环境要求

| 环境 | 要求 |
|------|------|
| **Node.js** | **v22.12 或更高** |
| **npm** | 随 Node.js 自带 |
| **系统** | Windows 10+ / Ubuntu 20.04+ |

---

## 🪟 Windows 部署

### 1️⃣ 安装 Node.js

**方法一（推荐）：** 访问 [nodejs.org](https://nodejs.org) 下载 **v22.x LTS**，运行安装程序（勾选"Add to PATH"）。

**方法二：winget**
```bash
winget install OpenJS.NodeJS.LTS
```

验证安装：
```bash
node -v    # 应显示 v22.x.x
npm -v     # 应显示 10.x.x
```

### 2️⃣ 克隆仓库

```bash
git clone https://github.com/yzp100911/xCrab-Agent.git
cd xCrab-Agent
```

### 3️⃣ 一键安装所有依赖

```bash
# 方式一：一键安装
npm run install:all

# 方式二：手动分步安装
npm install                    # xCrab-Agent
cd eclaw && npm install && cd ..  # eclaw-server
cd cclaw && npm install && cd ..  # claw-client
```

> ⚠️ 如果 `better-sqlite3` 编译报错，请安装 **Visual Studio Build Tools**（含 C++ 构建工具），或运行：
> ```bash
> npm install better-sqlite3 --force
> ```

### 4️⃣ 配置环境变量

```bash
copy .env.example .env
```

用记事本或 VS Code 打开 `.env`，填写必要的密钥：

| 变量 | 必填 | 说明 |
|------|------|------|
| `MINIMAX_API_KEY` | ✅ **必填** | MiniMax API 密钥（[获取](https://platform.minimaxi.com)） |
| `DEEPSEEK_API_KEY` | ❌ 可选 | DeepSeek API 密钥 |

> 如果你不需要连接 AI（仅使用中转和终端功能），可以先不填密钥。

### 5️⃣ 启动组件

**启动 AI 对话引擎：**
```bash
npm start
```

**启动中转调度服务器**（新开一个终端）：
```bash
npm run start:eclaw
```

**启动远程执行终端**（新开一个终端）：
```bash
npm run start:cclaw
```

---

## 🐧 Linux 部署（Ubuntu / CentOS）

### 1️⃣ 安装 Node.js

**Ubuntu/Debian：**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL：**
```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

验证安装：
```bash
node -v    # 应显示 v22.x.x
npm -v     # 应显示 10.x.x
```

### 2️⃣ 克隆仓库

```bash
sudo apt-get install -y git   # Ubuntu
# sudo yum install -y git     # CentOS

git clone https://github.com/yzp100911/xCrab-Agent.git
cd xCrab-Agent
```

### 3️⃣ 一键安装所有依赖

```bash
# 方式一：一键安装
npm run install:all
# 或 bash install-all.sh

# 方式二：手动分步
npm install
cd eclaw && npm install && cd ..
cd cclaw && npm install && cd ..
```

> 如果 `better-sqlite3` 编译报错：
> ```bash
> sudo apt-get install -y build-essential python3
> ```

### 4️⃣ 配置环境变量

```bash
cp .env.example .env
nano .env   # 填写 API 密钥
```

### 5️⃣ 启动组件

```bash
# 启动 AI 对话引擎
node index.js

# 启动中转调度服务器（新开终端）
node eclaw/server.js

# 启动远程执行终端（新开终端）
node cclaw/index.js
```

### 6️⃣ ★ 设置开机自启（systemd 服务）

**所有组件都提供了 systemd 服务文件：**

```bash
# 🧠 xCrab-Agent
sudo cp xcrab.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable xcrab
sudo systemctl start xcrab

# 📡 eclaw-server
sudo cp eclaw/eclaw.service /etc/systemd/system/
sudo systemctl enable eclaw
sudo systemctl start eclaw

# 🤖 claw-client
sudo cp cclaw/cclaw.service /etc/systemd/system/
sudo systemctl enable cclaw
sudo systemctl start cclaw
```

> ⚠️ 记得修改 `.service` 文件中的 `WorkingDirectory` 和 `ExecStart` 路径为你的实际部署路径。

---

## ⚙️ 环境变量完整说明

### 🧠 xCrab-Agent 配置

| 变量 | 默认值 | 必填 | 说明 |
|------|--------|------|------|
| `MINIMAX_API_KEY` | - | ✅ | MiniMax API 密钥 |
| `MINIMAX_BASE_URL` | `https://api.minimaxi.com/v1` | ❌ | MiniMax API 地址 |
| `DEEPSEEK_API_KEY` | - | ❌ | DeepSeek API 密钥 |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | ❌ | DeepSeek API 地址 |
| `MODEL` | `MiniMax-M2.7` | ❌ | 使用的模型 |
| `ENABLE_MEMORY` | `false` | ❌ | 启用持久化记忆 |
| `GATEWAY_ENABLED` | `false` | ❌ | 启用 Gateway HTTP 服务 |
| `GATEWAY_PORT` | `3000` | ❌ | Gateway 服务端口 |
| `GATEWAY_JWT_SECRET` | - | ❌ | Gateway JWT 密钥 |
| `GATEWAY_TOKEN` | - | ❌ | Gateway 静态令牌 |

### 📡 eclaw-server 配置

| 变量 | 默认值 | 必填 | 说明 |
|------|--------|------|------|
| `ECLAW_PORT` | `10090` | ❌ | 服务器监听端口 |
| `XCRAB_API_URL` | `http://localhost:3000` | ❌ | xCrab-Agent 网关地址 |
| `XCRAB_TOKEN` | - | ❌ | 鉴权令牌 |

### 🤖 claw-client 配置

| 变量 | 默认值 | 必填 | 说明 |
|------|--------|------|------|
| `ECLAW_API_URL` | `http://127.0.0.1:10090` | ✅ | eclaw-server API 地址 |
| `ECLAW_WS_URL` | `ws://127.0.0.1:10090/ws` | ✅ | eclaw-server WebSocket 地址 |
| `CCLAW_AI_BACKEND` | `xcrab` | ❌ | AI 后端选择（xcrab / hermes） |
| `XCRAB_GATEWAY_URL` | `http://localhost:3000` | ❌ | xCrab-Agent 网关地址 |
| `XCRAB_GATEWAY_TOKEN` | - | ❌ | xCrab-Agent 网关令牌 |

---

## 📁 项目结构

```
xCrab-Agent/
├── index.js                   # 🧠 AI 入口文件
├── package.json               # 根依赖配置
├── .env                       # 环境变量（从 .env.example 复制）
├── .env.example               # 环境变量模板
├── install-all.sh             # 一键安装脚本（Linux）
│
├── src/                       # 🧠 AI 核心源码
│   ├── cli.js                 # 命令行交互
│   ├── llm.js                 # LLM 调用
│   ├── tools.js               # 工具函数注册
│   ├── skill-manager.js       # 技能管理器
│   ├── gateway/               # HTTP API 网关
│   ├── mcp/                   # MCP 协议客户端
│   ├── workspace/             # 工作区管理
│   └── ...
│
├── skills/                    # 🧠 技能模块
├── tests/                     # 🧠 测试文件
│
├── eclaw/                     # 📡 中转调度服务器
│   ├── server.js              # 主服务器入口
│   ├── package.json           # 依赖配置（CommonJS）
│   ├── cloud-sync.js          # 云同步
│   ├── wclaw/                 # 网页前端
│   │   ├── index.html         # 主页面
│   │   ├── app.js             # 前端入口
│   │   ├── app-base.js        # 基础逻辑
│   │   ├── app-auth.js        # 登录认证
│   │   ├── app-main.js        # 主逻辑
│   │   ├── styles.css         # 样式
│   │   └── icon/              # 图标
│   └── README.md              # 部署说明
│
├── cclaw/                     # 🤖 远程执行终端
│   ├── index.js               # 终端入口
│   ├── package.json           # 依赖配置（CommonJS）
│   ├── status-monitor.js      # 状态监控
│   ├── send_hello.py          # 发送问候
│   ├── start.sh               # 启动脚本
│   ├── .playwright-cli/       # Playwright CLI
│   └── README.md              # 部署说明
│
├── xcrab.service              # 🧠 AI systemd 服务文件
├── eclaw/eclaw.service        # 📡 中转 systemd 服务文件（如存在）
├── cclaw/cclaw.service        # 🤖 终端 systemd 服务文件
│
├── uploads/                   # 文件上传目录
└── README.md                  # 本文件（中英文）
```

---

## 🔧 故障排除

| 问题 | 解决方案 |
|------|----------|
| `MINIMAX_API_KEY` 未配置 | 检查 `.env` 文件是否正确配置 |
| `better-sqlite3` 安装失败 | 安装 build-essential（Linux）或 VS Build Tools（Windows） |
| 端口被占用 | 修改 `.env` 中的 `GATEWAY_PORT` 或 `ECLAW_PORT` |
| WebSocket 连接失败 | 检查 `ECLAW_WS_URL` 地址和端口是否正确 |
| eclaw-server 启动后无法访问前端 | 确认 `wclaw/` 目录存在且 `server.js` 正确配置了静态文件路径 |

### 获取 API 密钥

- **MiniMax API**：前往 [https://platform.minimaxi.com](https://platform.minimaxi.com) 注册获取
- **DeepSeek API**（可选）：前往 [https://platform.deepseek.com](https://platform.deepseek.com) 注册获取

---

## 📝 许可证

MIT
