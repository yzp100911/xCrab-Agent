[🇨🇳 中文](README.md) | [🇬🇧 English](README_EN.md)

> ⚠️ **注意！！！** 如果你觉得部署麻烦，可以让 AI 帮你完成部署。

# skillgate-agent 🚪

**skillgate-agent** — AI 个人助手全家桶，包含四个核心组件：**xCrab（AI 执行引擎）**、**eclaw（服务调度端）**、**cclaw（远程分发端）**、**wclaw（网页客户端）**。

下载一个仓库，即可完整部署。

---

---

## ⚠️ 品牌声明

**skillgate-agent** 是一个独立开发的中文开源项目，与 [OpenClaw](https://github.com/openclaw/openclaw)（开源 AI 代理框架）没有任何关联、衍生、授权或赞助关系。

### 项目定位

skillgate-agent 是一款**多模型 AI 网关**，专注于：
- 模型聚合与路由
- API 统一接入
- 高速、低延迟的转发服务
- 支持 MiniMax、DeepSeek 等国内主流模型

### 命名来源

- **"Crab"** 代表螃蟹 —— 象征高效、迅速、横向移动
- 整体命名参考了开源社区中常见的动物系命名惯例（如 TensorFlow、Camel 等），并无心模仿或混淆任何现有品牌

### 商标声明

1. skillgate-agent 项目名称及相关标识由项目作者独立创作
2. 如需在商业产品中使用 skillgate-agent 代码或名称，请自行评估并承担相关法律责任
3. 本项目作者不对因使用本项目导致的任何商标或知识产权纠纷负责

### 联系方式

如有任何品牌相关问题，请通过 GitHub Issues 联系项目维护者。



## 📦 系统架构

```
┌───────────────────────────────────────────────────────────────────────┐
│                          skillgate-agent（本仓库）                            │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │          xCrab（AI 执行引擎）                                  │     │
│  │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │     │
│  │   │ LLM 调用      │   │ 工具/技能     │   │ MCP 客户端    │   │     │
│  │   │ MiniMax      │   │ 注册中心     │   │ 扩展通信      │   │     │
│  │   │ DeepSeek     │   │ 技能模块     │   │              │   │     │
│  │   └──────────────┘   └──────────────┘   └──────────────┘   │     │
│  └─────────────────────────┬───────────────────────────────────┘     │
│                            │                                         │
│                            ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │             eclaw（服务调度端）                                 │     │
│  │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │     │
│  │   │ HTTP API     │   │ WebSocket    │   │ MySQL 数据库  │   │     │
│  │   │ 路由/鉴权    │   │ 消息转发      │   │ 用户/历史/    │   │     │
│  │   │              │   │              │   │ 收藏/反馈    │   │     │
│  │   └──────────────┘   └──────────────┘   └──────────────┘   │     │
│  └─────┬─────────────────────────┬────────────────────────────┘     │
│        │                         │                                   │
│        ▼                         ▼                                   │
│  ┌─────────────────┐   ┌─────────────────────┐                      │
│  │ wclaw（网页端）   │   │ cclaw（分发端）       │                      │
│  │ 聊天界面         │   │ WebSocket 远程      │                      │
│  │ 会话管理         │◄──►│ 命令执行终端        │                      │
│  │ 文件展示         │   │ 状态监控            │                      │
│  │ 设置/收藏        │   │ 心跳保活            │                      │
│  └─────────────────┘   └─────────────────────┘                      │
└───────────────────────────────────────────────────────────────────────┘
```

### 组件说明

| 组件 | 路径 | 角色 | 职责 |
|------|------|------|------|
| 🧠 **xCrab** | `./xCrab/` | AI 执行引擎 | 调用 LLM（MiniMax/DeepSeek）、管理对话上下文、执行工具/技能、Gateway HTTP 服务 |
| 📡 **eclaw** | `./xCrab/eclaw/` | 服务调度端 | HTTP API + WebSocket 服务、用户登录/注册/鉴权、消息路由转发、MySQL 数据库管理 |
| 🖥️ **wclaw** | `./xCrab/wclaw/` | 网页客户端 | 聊天界面、会话管理、消息展示、文件显示、收藏/反馈、模型切换 |
| 🤖 **cclaw** | `./xCrab/cclaw/` | 远程分发端 | WebSocket 连接服务端、在远程机器执行命令、状态监控上报、心跳保活 |

---

## 🚀 快速开始

### 📋 环境要求

| 环境 | 要求 |
|------|------|
| **Node.js** | **v22.12 或更高** |
| **npm** | 随 Node.js 自带 |
| **MySQL** | **8.0+**（必须安装并运行） |
| **系统** | Windows 10+ / Ubuntu 20.04+ / macOS |

---

## 🗄️ 数据库配置（必须先完成）

eclaw（服务调度端）**依赖 MySQL 数据库**存储用户账号、聊天历史、收藏、反馈等数据。

### 1️⃣ 安装 MySQL

**Windows：**
1. 前往 [MySQL 官网](https://dev.mysql.com/downloads/installer/) 下载 MySQL Installer
2. 安装过程中设置 **root 密码**（请牢记）
3. 记下 MySQL 端口（默认 `3306`）

**Ubuntu/Debian：**
```bash
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**macOS（Homebrew）：**
```bash
brew install mysql
brew services start mysql
```

### 2️⃣ 创建数据库

连接 MySQL 并创建数据库。应用启动时也会自动尝试创建，但建议先手动创建：

```bash
mysql -u root -p
```

在 MySQL 提示符下执行：
```sql
CREATE DATABASE IF NOT EXISTS wclaw_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

或者一行命令完成：
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS wclaw_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3️⃣ 配置数据库连接

在 `xCrab/.env` 文件中配置数据库连接信息（参考 `xCrab/.env.example`）：

| 变量 | 默认值 | 必填 | 说明 |
|------|--------|------|------|
| `DB_HOST` | `127.0.0.1` | ❌ | MySQL 主机地址（本地部署不用改） |
| `DB_PORT` | `3306` | ❌ | MySQL 端口 |
| `DB_USER` | `root` | ❌ | 数据库用户名 |
| `DB_PASS` | （空） | ✅ | **你的 MySQL 密码** |
| `DB_NAME` | `wclaw_db` | ❌ | 数据库名 |

> ⚠️ **注意：** 代码中默认的 `DB_USER=wclaw_db` 和 `DB_PASS=100911yzpYZP` **仅是示例值**。部署时必须修改为你**自己**的数据库账号密码。请勿直接使用示例值。

### 4️⃣ 自动建表

应用启动时会自动检测并创建以下数据表（无需手动执行 SQL）：

| 表名 | 用途 |
|------|------|
| `users` | 用户账号、密码、手机号 |
| `history` | 聊天历史记录 |
| `feedbacks` | 用户反馈 |
| `favorites` | 用户收藏/书签 |
| `notifications` | 系统通知 |

---

## 🪟 Windows 部署

### 1️⃣ 安装 Node.js

**方法一（推荐）：** 访问 [nodejs.org](https://nodejs.org) 下载 **v22.x LTS**，运行安装程序（勾选 "Add to PATH"）。

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
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent
```

### 3️⃣ 安装依赖

```bash
cd xCrab
npm install
```

如果 `better-sqlite3` 编译报错，请安装 **Visual Studio Build Tools**（含 C++ 构建工具），或运行：
```bash
npm install better-sqlite3 --force
```

### 4️⃣ 配置环境变量

```bash
copy .env.example .env
```

用记事本或 VS Code 打开 `xCrab/.env`，填写以下**必填项**：

| 变量 | 必填 | 说明 |
|------|------|------|
| `MINIMAX_API_KEY` | ✅ **必填** | MiniMax API 密钥（[获取](https://platform.minimaxi.com)） |
| `DEEPSEEK_API_KEY` | ❌ 可选 | DeepSeek API 密钥 |
| `DB_PASS` | ✅ **必填** | **你的** MySQL 数据库密码 |

### 5️⃣ 启动服务

**方式一：分别启动（推荐调试时使用）**

```bash
# 终端 1：启动 AI 执行引擎（xCrab Gateway）
cd xCrab
npm start

# 终端 2：启动服务调度端（eclaw，含网页端）
cd xCrab/eclaw
npm install
node server.js

# 终端 3：启动分发端（cclaw，可选，仅需要远程执行时）
cd xCrab/cclaw
npm install
node index.js
```

**方式二：一键启动全部**
```bash
cd xCrab
npm run start:all
```

> 启动成功后，浏览器访问 **http://localhost:10090** 即可打开网页端。

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

### 2️⃣ 克隆仓库与安装 MySQL

```bash
sudo apt-get install -y git mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent
```

### 3️⃣ 创建数据库

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS wclaw_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4️⃣ 安装依赖并配置

```bash
cd xCrab
npm install
cp .env.example .env
nano .env   # 填写 API 密钥和数据库密码
```

### 5️⃣ 启动服务

```bash
# AI 执行引擎
cd xCrab && npm start &

# 服务调度端（含网页端）
cd xCrab/eclaw && node server.js &

# 一键启动
cd xCrab && npm run start:all
```

> 启动后访问 **http://你的服务器IP:10090** 即可打开网页端。

### 6️⃣ ★ 设置开机自启（systemd）

以下列出了三个组件的 systemd 服务文件。**请将 `/path/to/skillgate-agent` 替换为你的实际部署路径。**

```bash
# 🧠 xCrab AI 执行引擎
sudo tee /etc/systemd/system/xcrab.service > /dev/null << 'EOF'
[Unit]
Description=xCrab AI Engine
After=network.target mysql.service
Requires=mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/skillgate-agent/xCrab
ExecStart=/usr/bin/node /path/to/skillgate-agent/xCrab/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 📡 eclaw 服务调度端（含网页端）
sudo tee /etc/systemd/system/eclaw.service > /dev/null << 'EOF'
[Unit]
Description=Eclaw Service (WebSocket + API)
After=network.target mysql.service
Requires=mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/skillgate-agent/xCrab/eclaw
ExecStart=/usr/bin/node /path/to/skillgate-agent/xCrab/eclaw/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 🤖 cclaw 远程分发端（可选，仅需远程执行时）
sudo tee /etc/systemd/system/cclaw.service > /dev/null << 'EOF'
[Unit]
Description=Cclaw Client (Remote Execution)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/skillgate-agent/xCrab/cclaw
ExecStart=/usr/bin/node /path/to/skillgate-agent/xCrab/cclaw/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 重新加载并启动
sudo systemctl daemon-reload
sudo systemctl enable xcrab eclaw cclaw
sudo systemctl start xcrab eclaw
```

---

## ⚙️ 环境变量完整说明

### 🧠 xCrab AI 执行引擎

| 变量 | 默认值 | 必填 | 说明 |
|------|--------|------|------|
| `MINIMAX_API_KEY` | - | ✅ | MiniMax API 密钥（[获取](https://platform.minimaxi.com)） |
| `MINIMAX_BASE_URL` | `https://api.minimaxi.com/v1` | ❌ | MiniMax API 地址 |
| `DEEPSEEK_API_KEY` | - | ❌ | DeepSeek API 密钥 |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | ❌ | DeepSeek API 地址 |
| `MODEL` | `MiniMax-M2.7` | ❌ | 使用的模型 |
| `ENABLE_MEMORY` | `false` | ❌ | 启用持久化记忆 |
| `GATEWAY_PORT` | `3000` | ❌ | xCrab Gateway HTTP 端口 |

### 📡 eclaw 服务调度端

| 变量 | 默认值 | 必填 | 说明 |
|------|--------|------|------|
| `ECLAW_PORT` | `10090` | ❌ | 服务监听端口（网页端访问端口） |
| `DB_HOST` | `127.0.0.1` | ❌ | MySQL 主机地址 |
| `DB_PORT` | `3306` | ❌ | MySQL 端口 |
| `DB_USER` | `root` | ❌ | 数据库用户名 |
| `DB_PASS` | （空） | ✅ | **你的 MySQL 密码** |
| `DB_NAME` | `wclaw_db` | ❌ | 数据库名 |
| `XCRAB_API_URL` | `http://localhost:3000` | ❌ | xCrab Gateway 地址 |
| `XCRAB_TOKEN` | - | ❌ | xCrab 鉴权令牌 |

### 🤖 cclaw 远程分发端

| 变量 | 默认值 | 必填 | 说明 |
|------|--------|------|------|
| `ECLAW_API_URL` | `http://127.0.0.1:10090` | ✅ | eclaw 服务 HTTP 地址 |
| `ECLAW_WS_URL` | `ws://127.0.0.1:10090/ws` | ✅ | eclaw 服务 WebSocket 地址 |
| `CCLAW_USERNAME` | `ad1009` | ❌ | 分发端登录用户名（需在 eclaw 注册） |

---

## 📁 项目结构

```
skillgate-agent/
├── README.md                   # 本文件（中文）
├── README_EN.md                # 本文件（英文）
├── .gitignore
├── LICENSE
│
└── xCrab/                      # 🧠 AI 执行引擎（主目录）
    ├── index.js                # 入口文件
    ├── package.json            # 依赖管理
    ├── .env.example            # 环境变量模板
    ├── .env                    # 环境变量（需自行创建）
    │
    ├── src/                    # 🧠 AI 核心源码
    │   ├── cli.js              # 命令行交互
    │   ├── llm.js              # LLM 调用（MiniMax/DeepSeek）
    │   ├── tools.js            # 工具函数注册
    │   ├── skill-manager.js    # 技能管理器
    │   ├── gateway/            # HTTP API 网关
    │   │   ├── server.js       # Gateway 服务
    │   │   ├── api-handler.js  # API 处理
    │   │   ├── llm-stream.js   # 流式 LLM 响应
    │   │   └── frontend/       # xCrab 自带前端
    │   ├── config.js           # 配置管理
    │   ├── history.js          # 对话历史
    │   ├── planner.js          # 任务规划
    │   └── mcp/                # MCP 协议客户端
    │
    ├── skills/                 # 🧠 技能模块
    ├── tests/                  # 🧠 测试文件
    │
    ├── eclaw/                  # 📡 服务调度端
    │   ├── server.js           # 服务入口（含 API + WebSocket）
    │   ├── cloud-sync.js       # 数据库配置模块
    │   ├── package.json        # 依赖（express, mysql2, ws）
    │   └── users.json          # 本地用户缓存
    │
    ├── wclaw/                  # 🖥️ 网页客户端
    │   ├── index.html          # 主页面
    │   ├── app.js              # 前端入口
    │   ├── app-base.js         # 基础逻辑
    │   ├── app-auth.js         # 登录认证
    │   ├── app-main.js         # 主逻辑
    │   ├── styles.css          # 样式
    │   └── icon/               # 图标
    │
    ├── cclaw/                  # 🤖 远程分发端
    │   ├── index.js            # 终端入口
    │   ├── status-monitor.js   # 状态监控
    │   ├── package.json        # 依赖
    │   └── data/               # agent 配置
    │
    ├── data/                   # AI 运行时数据
    └── uploads/                # 文件上传目录
```

---

## 🔧 故障排除

| 问题 | 解决方案 |
|------|----------|
| MySQL 连接失败：`ECONNREFUSED` | 检查 MySQL 服务是否启动：`systemctl status mysql` |
| MySQL 连接失败：`ER_ACCESS_DENIED_ERROR` | 检查 `.env` 中的 `DB_USER` 和 `DB_PASS` 是否正确 |
| MySQL 连接失败：`ER_BAD_DB_ERROR` | 先创建数据库：`mysql -u root -p -e "CREATE DATABASE wclaw_db"` |
| MiniMax API 返回 401 | 检查 `MINIMAX_API_KEY` 是否正确 |
| 网页端访问 404 | 确认 `eclaw/server.js` 中的静态文件路径指向 `../wclaw/` |
| 端口被占用 | 修改 `.env` 中的 `ECLAW_PORT` 或 `GATEWAY_PORT` |
| `better-sqlite3` 安装失败 | 安装 build-essential（Linux）或 VS Build Tools（Windows） |

### 获取 API 密钥

- **MiniMax API**：前往 [https://platform.minimaxi.com](https://platform.minimaxi.com) 注册获取
- **DeepSeek API**（可选）：前往 [https://platform.deepseek.com](https://platform.deepseek.com) 注册获取

---

## 📝 License

MIT
