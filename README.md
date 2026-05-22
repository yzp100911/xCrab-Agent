[🇨🇳 中文] | [🇬🇧 English](README_EN.md)

# xCrab-Agent 🦀

**xCrab** — 迷你型 AI 个人助手，基于 MiniMax 和 DeepSeek 驱动的多模型 AI 网关，支持工具调用、浏览器自动化和技能扩展。

---

## 📦 系统架构关系

```
  xCrab-Agent (本仓库)          eclaw-server               claw-client
  ┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
  │  🧠 AI 大脑      │     │  📡 中转调度服务器  │     │  🤖 执行终端     │
  │  对话引擎        │◄───►│  转发指令/回复     │◄───►│  服务器上执行命令 │
  │  工具调用        │     │  管理 WebSocket   │     │  node-pty 终端   │
  │  技能扩展        │     │  网页前端 (wclaw) │     │  WebSocket 连接  │
  └─────────────────┘     └──────────────────┘     └──────────────────┘
```

> - [**xCrab-Agent**](https://github.com/yzp100911/xCrab-Agent) = AI 对话引擎（你面前的智能助手）
> - [**eclaw-server**](https://github.com/yzp100911/eclaw-server) = 中转服务器（网页端 ↔ 执行端 的桥梁）
> - [**claw-client**](https://github.com/yzp100911/claw-client) = 执行终端（在目标服务器上执行命令）

---

## 🚀 部署指南（Windows / Linux）

### 📋 环境要求

| 环境 | 要求 | 说明 |
|------|------|------|
| **Node.js** | **v22.12 或更高** | 必须 22.12+，推荐 v22.x LTS |
| **npm** | 随 Node.js 自带 | 无需额外安装 |
| **系统** | Windows 10+ / Ubuntu 20.04+ | 已测试 |

---

## 🪟 Windows 环境部署

### 1️⃣ 安装 Node.js

**方法一（推荐）：官网下载安装包**
- 访问 [https://nodejs.org](https://nodejs.org) 下载 **v22.x LTS** 版本
- 运行安装程序，全程默认选项（勾选"Add to PATH"）
- 安装完成后打开 **命令提示符 (cmd)** 或 **PowerShell**，验证安装：

```bash
node -v    # 应显示 v22.x.x
npm -v     # 应显示 10.x.x
```

**方法二：使用 winget 安装**
```bash
winget install OpenJS.NodeJS.LTS
```

### 2️⃣ 克隆仓库

```bash
# 先安装 Git（https://git-scm.com/downloads/win）
git clone https://github.com/yzp100911/xCrab-Agent.git
cd xCrab-Agent
```

### 3️⃣ 安装依赖

```bash
npm install
```

> ⚠️ **Windows 构建注意**：如果安装 `better-sqlite3` 报错，请确保已安装：
> - **Visual Studio Build Tools**（含 C++ 构建工具）
> - 或直接使用预编译版：`npm install --build-from-source`
> - 或尝试：`npm install better-sqlite3 --force`

### 4️⃣ 配置环境变量

```bash
# 复制环境变量模板
copy .env.example .env
```

打开 `.env` 文件（用记事本或 VS Code），填写必要的密钥：

| 变量 | 必填 | 说明 |
|------|------|------|
| `MINIMAX_API_KEY` | ✅ **必填** | MiniMax API 密钥（[获取](https://platform.minimaxi.com)） |
| `DEEPSEEK_API_KEY` | ❌ 可选 | DeepSeek API 密钥，切换模型时使用 |
| `MODEL` | ❌ 可选 | 默认 `MiniMax-M2.7` |
| `GATEWAY_PORT` | ❌ 可选 | Gateway HTTP 端口（默认 3000） |

### 5️⃣ 启动 xCrab

```bash
npm start
```

或直接：

```bash
node index.js
```

看到以下输出即启动成功：
```
  🦀 xCrab v2.0.0
  模型: MiniMax-M2.7
  API: https://api.minimaxi.com/v1
  记忆: 已启用
```

---

## 🐧 Linux 环境部署（Ubuntu / CentOS）

### 1️⃣ 安装 Node.js

**Ubuntu/Debian：**

```bash
# 安装 Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v    # 应显示 v22.x.x
npm -v     # 应显示 10.x.x
```

**CentOS/RHEL：**

```bash
# 安装 Node.js 22.x
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v
```

### 2️⃣ 克隆仓库

```bash
# 安装 Git
sudo apt-get install -y git    # Ubuntu
# sudo yum install -y git      # CentOS

git clone https://github.com/yzp100911/xCrab-Agent.git
cd xCrab-Agent
```

### 3️⃣ 安装依赖

```bash
npm install
```

> 如果 `better-sqlite3` 编译报错，安装构建工具：
> ```bash
> sudo apt-get install -y build-essential python3    # Ubuntu
> # sudo yum groupinstall -y "Development Tools"     # CentOS
> ```

### 4️⃣ 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件（填写你的 API 密钥）
nano .env
```

### 5️⃣ 启动 xCrab

```bash
# 直接启动
node index.js

# 或使用 npm
npm start
```

### 6️⃣ ★ 设置开机自启（systemd 服务）

```bash
# 复制服务文件到 systemd 目录
sudo cp xcrab.service /etc/systemd/system/

# 修改服务文件中的路径（如果部署路径不是 /opt/cclaw-client/UbuntuClaw/xCrab）
# sudo nano /etc/systemd/system/xcrab.service
# 修改 WorkingDirectory 和 ExecStart 为你的实际路径

# 重新加载 systemd
sudo systemctl daemon-reload

# 启用并启动服务
sudo systemctl enable xcrab
sudo systemctl start xcrab

# 查看服务状态
sudo systemctl status xcrab

# 查看实时日志
sudo journalctl -u xcrab -f
```

---

## ⚙️ 环境变量完整说明

| 变量 | 默认值 | 必填 | 说明 |
|------|--------|------|------|
| `MINIMAX_API_KEY` | - | ✅ | MiniMax API 密钥 |
| `MINIMAX_BASE_URL` | `https://api.minimaxi.com/v1` | ❌ | MiniMax API 地址 |
| `DEEPSEEK_API_KEY` | - | ❌ | DeepSeek API 密钥（可选） |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | ❌ | DeepSeek API 地址 |
| `MODEL` | `MiniMax-M2.7` | ❌ | 使用的模型 |
| `ENABLE_MEMORY` | `false` | ❌ | 是否启用持久化记忆 |
| `MEMORY_DB_PATH` | `./memory/memories.db` | ❌ | 记忆数据库路径 |
| `MEMORY_AUTO_SUMMARY` | `true` | ❌ | 自动保存对话摘要 |
| `GATEWAY_ENABLED` | `false` | ❌ | 是否启用 Gateway HTTP 服务 |
| `GATEWAY_PORT` | `3000` | ❌ | Gateway 服务端口 |
| `GATEWAY_JWT_SECRET` | - | ❌ | Gateway JWT 密钥 |
| `GATEWAY_TOKEN` | - | ❌ | Gateway 静态令牌 |
| `MCP_SERVERS` | `[]` | ❌ | MCP 服务器配置（JSON） |
| `WORKSPACE_DIR` | `./data` | ❌ | 工作区根目录 |
| `ACTIVE_WORKSPACE` | `main` | ❌ | 默认激活的工作区 |

---

## 📁 项目结构

```
xCrab-Agent/
├── index.js              # 入口文件（启动请用此文件）
├── package.json          # 依赖配置
├── .env                  # 环境变量配置（从 .env.example 复制）
├── .env.example          # 环境变量模板
│
├── src/                  # 核心源码
│   ├── config.js         # 配置加载
│   ├── llm.js            # LLM 调用
│   ├── tools.js          # 工具函数注册
│   ├── cli.js            # 命令行交互
│   ├── skill-manager.js  # 技能管理器
│   │
│   ├── gateway/          # HTTP API 网关
│   │   └── server.js
│   ├── memory/           # SQLite 记忆系统
│   │   └── store.js
│   ├── mcp/              # MCP 协议客户端
│   │   └── client.js
│   ├── stats/            # 统计追踪
│   │   ├── tracker.js
│   │   └── quota-tracker.js
│   ├── workspace/        # 工作区管理
│   │   └── manager.js
│   └── hooks/            # 生命周期钩子
│       └── registry.js
│
├── skills/               # 技能模块（技能市场安装）
├── tools/                # 工具函数目录
├── tests/                # 测试文件
├── data/                 # 工作区数据目录
├── mcp-servers/          # MCP 服务器目录
│
├── xcrab.service         # Linux systemd 服务文件
└── README.md             # 本文件
```

---

## 🔧 故障排除

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| `MINIMAX_API_KEY` 未配置 | 检查是否已将 `.env.example` 复制为 `.env`，并填写了密钥 |
| `better-sqlite3` 安装失败 | 安装 `build-essential`（Linux）或 Visual Studio Build Tools（Windows） |
| 端口被占用 | 修改 `.env` 中的 `GATEWAY_PORT` 或关闭占用端口的程序 |
| 找不到模块 | 执行 `npm install` 重新安装依赖 |

### 获取 API 密钥

- **MiniMax API**：前往 [https://platform.minimaxi.com](https://platform.minimaxi.com) 注册获取
- **DeepSeek API**（可选）：前往 [https://platform.deepseek.com](https://platform.deepseek.com) 注册获取

---

## 📝 许可证

MIT
