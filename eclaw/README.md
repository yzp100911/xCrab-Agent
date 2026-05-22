[🇨🇳 中文] | [🇬🇧 English](README_EN.md)

# eClaw Server

> 🌐 eClaw Web Server — Node.js + Express + WebSocket, providing user authentication, file upload, and integration with xCrab Gateway

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js v18+](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Stars](https://img.shields.io/github/stars/yzp100911/eclaw-server?style=social)](https://github.com/yzp100911/eclaw-server)
[![Forks](https://img.shields.io/github/forks/yzp100911/eclaw-server?style=social)](https://github.com/yzp100911/eclaw-server)

## 🏗️ 项目关系

```
🌐 网页端 → 📡 eclaw-server（中转调度） → 🤖 claw-client（终端执行）
                                            ↓
                                      🧠 xCrab-Agent（AI 大脑）
```
eclaw-server 是三者中的 **中转调度服务器**，负责：
- 接收网页端指令，转发给 claw-client 执行
- 接收 claw-client 执行结果，推回网页端
- 提供用户认证、文件上传、WebSocket 实时通信等 API
| 项目 | 角色 | 仓库 |
|------|------|------|
| 🧠 xCrab-Agent | AI 大脑（对话引擎 + 工具调用） | [xCrab-Agent](https://github.com/yzp100911/xCrab-Agent) |
| 📡 eclaw-server | 中转调度服务器（当前项目） | 就是这里！ |
| 🤖 claw-client | 终端执行器（驻守服务器执行命令） | [claw-client](https://github.com/yzp100911/claw-client) |
---
## Features
- **User Authentication System** — JWT token authentication, supporting registration and login
- **File Upload** — Support for file upload and management
- **WebSocket Real-time Communication** — Maintains long connection with clients
- **xCrab Gateway Integration** — Seamlessly integrates with xCrab Agent multi-model gateway
- **MySQL Data Storage** — Persistent user data and configuration
## Requirements
- Node.js v18+
- MySQL 5.7+
- npm or pnpm
---
## 🚀 部署指南
### 📥 1. 克隆与安装依赖
```bash
git clone https://github.com/yzp100911/eclaw-server.git
cd eclaw-server
npm install
```
### ⚙️ 2. 配置环境变量
复制模板文件并重命名为 `.env`：
<details>
<summary>🪟 Windows</summary>
```bash
copy .env.example .env
```
</details>
<details>
<summary>🐧 Linux / macOS</summary>
```bash
cp .env.example .env
```
</details>
编辑 `.env` 文件，修改以下配置：
```env
PORT=3001           # 服务端口号
JWT_SECRET=xxx      # JWT 密钥，请改为随机字符串
MYSQL_PASSWORD=xxx  # 本地 MySQL root 密码
XCRAB_TOKEN=xxx     # 与 xCrab-Agent 的 GATEWAY_TOKEN 保持一致
```
### 🗄️ 3. 安装并配置本地 MySQL
> 所有三个项目部署在同一台机器时，使用本地数据库即可，无需 SSH 隧道或云数据库。
<details>
<summary>🪟 Windows 安装 MySQL</summary>
1. 从 [MySQL 官网](https://dev.mysql.com/downloads/installer/) 下载安装包
2. 安装时设置 root 密码（如 `123456`）
3. 验证安装：
   ```bash
   mysql -u root -p
   ```
</details>
<details>
<summary>🐧 Linux 安装 MySQL (Ubuntu)</summary>
```bash
sudo apt-get update
sudo apt-get install -y mysql-server
sudo mysql_secure_installation
# 设置 root 密码等
```
</details>
**创建数据库：**
```sql
CREATE DATABASE IF NOT EXISTS wclaw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
> ✅ **server.js 默认已连接本地 MySQL，无需修改代码！**
`server.js` 的连接池配置如下（可通过 `.env` 环境变量覆盖）：

```javascript
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "123456",
    database: process.env.MYSQL_DATABASE || "wclaw_db",
    ...
});
```
> ✅ **无需 SSH 私钥，无需云服务器连接，本地数据库安全可靠！**

---

### ▶️ 4. 启动服务

```bash
node server.js
```
服务默认运行在 `http://localhost:3001`。
---
## 📁 项目结构
```
eclaw-server/
├── server.js       # 🟢 主程序入口（连接本地 MySQL）
├── wclaw/          # 🌐 网页前端静态文件
├── uploads/        # 📂 上传文件存储目录
├── .env.example    # ⚙️ 环境变量模板
├── package.json
└── LICENSE
```
---
## 🔧 故障排除
| 问题 | 原因 | 解决 |
|------|------|------|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL 未运行或端口不对 | 检查 MySQL 是否启动，确认端口号 |
| `ER_BAD_DB_ERROR` | 数据库不存在 | 先用 `CREATE DATABASE wclaw_db;` 创建 |
| `ER_ACCESS_DENIED_ERROR` | 用户名或密码错误 | 检查 `.env` 中的 `MYSQL_USER` 和 `MYSQL_PASSWORD` |
| 端口被占用 | 3001 端口已被其他程序使用 | 修改 `.env` 中的 `PORT` |
---
## 🔄 systemd 自启（Linux）
```bash
sudo tee /etc/systemd/system/eclaw-server.service > /dev/null << 'EOF'
[Unit]
Description=eClaw Server
After=network.target mysql.service
[Service]
Type=simple
User=root
WorkingDirectory=/path/to/eclaw-server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable --now eclaw-server
```
---
## Related Projects
- [xCrab-Agent](https://github.com/yzp100911/xCrab-Agent) — AI Agent with MCP model gateway and skill marketplace
- [claw-client](https://github.com/yzp100911/claw-client) — Terminal client for executing commands on the server
