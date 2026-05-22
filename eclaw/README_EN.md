[🇨🇳 中文](README.md) | [🇬🇧 English]

# eClaw Server 🌐

**eClaw Server** — Node.js + Express + WebSocket relay server, providing user authentication, file upload, and integration with the xCrab Gateway.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/yzp100911/eclaw-server/blob/master/LICENSE)
[![Node.js v18+](https://img.shields.io/badge/Node.js-v18%2B-brightgreen)](https://nodejs.org/)
[![Stars](https://img.shields.io/github/stars/yzp100911/eclaw-server)](https://github.com/yzp100911/eclaw-server)
[![Forks](https://img.shields.io/github/forks/yzp100911/eclaw-server)](https://github.com/yzp100911/eclaw-server)

---

## 🏗️ Project Relationships

```
🌐 Web UI → 📡 eclaw-server (Relay & Dispatch) → 🤖 claw-client (Terminal Execution)
                ↓
          🧠 xCrab-Agent (AI Brain)
```

**eclaw-server** is the **relay & dispatch server** among the three, responsible for:
- Receiving commands from the web UI and forwarding them to claw-client for execution
- Receiving execution results from claw-client and pushing them back to the web UI
- Providing user authentication, file upload, WebSocket real-time communication, and other APIs

| Project | Role | Repository |
|---------|------|------------|
| 🧠 xCrab-Agent | AI Brain (dialogue engine + tool calling) | [xCrab-Agent](https://github.com/yzp100911/xCrab-Agent) |
| 📡 eclaw-server | Relay & Dispatch Server **(this project)** | Right here! |
| 🤖 claw-client | Terminal Executor (runs commands on the server) | [claw-client](https://github.com/yzp100911/claw-client) |

---

## Features

- **User Authentication System** — JWT token authentication, supporting registration and login
- **File Upload** — Support for file upload and management
- **WebSocket Real-time Communication** — Maintains long connection with clients
- **xCrab Gateway Integration** — Seamlessly integrates with xCrab Agent multi-model gateway
- **MySQL Data Storage** — Persistent user data and configuration

---

## Requirements

- Node.js v18+
- MySQL 5.7+
- npm or pnpm

---

## 🚀 Deployment Guide

### 📥 1. Clone & Install Dependencies

```bash
git clone https://github.com/yzp100911/eclaw-server.git
cd eclaw-server
npm install
```

### ⚙️ 2. Configure Environment Variables

Copy the template file and rename it to `.env`:

**🪟 Windows:**
```bash
copy .env.example .env
```

**🐧 Linux / macOS:**
```bash
cp .env.example .env
```

Edit the `.env` file and modify the following settings:

```env
PORT=3001               # Service port number
JWT_SECRET=xxx          # JWT secret, change to a random string
MYSQL_PASSWORD=xxx      # Local MySQL root password
XCRAB_TOKEN=xxx         # Must match xCrab-Agent's GATEWAY_TOKEN
```

### 🗄️ 3. Install & Configure Local MySQL

> All three projects running on the same machine use a local database — no SSH tunnel or cloud database needed.

**🪟 Windows:**
1. Download the installer from [MySQL Official Site](https://dev.mysql.com/downloads/installer/)
2. Set the root password during installation (e.g., `123456`)
3. Verify the installation:
```bash
mysql -u root -p
```

**🐧 Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install -y mysql-server
sudo mysql_secure_installation  # Set root password, etc.
```

**Create the database:**
```sql
CREATE DATABASE IF NOT EXISTS wclaw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> ✅ **server.js connects to local MySQL by default — no code changes needed!**
>
> The connection pool in `server.js` is configured as follows (overridable via `.env`):
>
> ```js
> const pool = mysql.createPool({
>   host: process.env.MYSQL_HOST || "127.0.0.1",
>   port: parseInt(process.env.MYSQL_PORT || "3306"),
>   user: process.env.MYSQL_USER || "root",
>   password: process.env.MYSQL_PASSWORD || "123456",
>   database: process.env.MYSQL_DATABASE || "wclaw_db",
>   ...
> });
> ```

> ✅ **No SSH private key needed, no cloud server connection required — secure and reliable local database!**

### ▶️ 4. Start the Service

```bash
node server.js
```

The service runs at **http://localhost:3001** by default.

---

## 📁 Project Structure

```
eclaw-server/
├── server.js              # 🟢 Main entry (connects to local MySQL)
├── wclaw/                 # 🌐 Web frontend static files
├── uploads/               # 📂 File upload storage directory
├── .env.example           # ⚙️ Environment variable template
├── package.json
└── LICENSE
```

---

## 🔧 Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL not running or wrong port | Check if MySQL is started, confirm the port number |
| `ER_BAD_DB_ERROR` | Database does not exist | Run `CREATE DATABASE wclaw_db;` first |
| `ER_ACCESS_DENIED_ERROR` | Wrong username or password | Check `MYSQL_USER` and `MYSQL_PASSWORD` in `.env` |
| Port already in use | Port 3001 is occupied | Change `PORT` in `.env` |

---

## 🔄 systemd Auto-start (Linux)

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

---

## 📝 License

MIT
