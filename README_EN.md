[🇨🇳 中文](README.md) | [🇬🇧 English](README_EN.md)

> ⚠️ **Attention!!!** If you find it troublesome, just ask AI to deploy it for you.

# OpenCrab 🦀

**OpenCrab** — The all-in-one AI personal assistant suite, consisting of four core components: **xCrab (AI Engine)**, **eclaw (Relay Server)**, **cclaw (Remote Agent)**, and **wclaw (Web UI)**.

Download one repo, deploy everything.

---


## ⚠️ Brand Statement

**OpenCrab** is an independently developed Chinese open-source project. It has **no affiliation, derivation, authorization, or sponsorship** with [OpenClaw](https://github.com/openclaw/openclaw) (the open-source AI agent framework).

### Project Positioning

- **OpenCrab**: Multi-model AI Gateway — focuses on model aggregation and routing, providing high-performance API proxy services
- **OpenClaw**: AI Agent Framework — focuses on autonomous task execution and multi-channel integration

The two projects have completely different positioning, target users, and technical architectures.

### Naming Origin

The name **"Crab"** comes from the Chinese homophone of the developer's nickname **"蟹蟹" (xiè xiè)**, representing gratitude and a crab-themed creative culture. It is **not** derived from or associated with OpenClaw's "Claw" naming.

### Trademark Disclaimer

- All product names, trademarks, and registered trademarks mentioned in this document belong to their respective owners
- OpenCrab is developed and maintained by individual developer **yzp100911**
- This project is for learning and communication purposes only

### Contact

If you have any questions or suggestions, please submit them via [GitHub Issues](https://github.com/yzp100911/OpenCrab/issues).

---


## 📦 System Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                         OpenCrab (This Repo)                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │              xCrab（AI Engine）                                │     │
│  │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │     │
│  │   │ LLM Call     │   │ Tools/Skills │   │ MCP Client   │   │     │
│  │   │ MiniMax     │   │ Registry     │   │ Extension    │   │     │
│  │   │ DeepSeek    │   │ Skill Mods   │   │ Communication│   │     │
│  │   └──────────────┘   └──────────────┘   └──────────────┘   │     │
│  └─────────────────────────┬───────────────────────────────────┘     │
│                            │                                         │
│                            ▼                                         │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │           eclaw (Relay Server)                                │     │
│  │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │     │
│  │   │ HTTP API     │   │ WebSocket    │   │ MySQL DB     │   │     │
│  │   │ Routing/Auth │   │ Message Relay│   │ Users/History│   │     │
│  │   │              │   │              │   │ Favorites    │   │     │
│  │   └──────────────┘   └──────────────┘   └──────────────┘   │     │
│  └─────┬─────────────────────────┬────────────────────────────┘     │
│        │                         │                                   │
│        ▼                         ▼                                   │
│  ┌─────────────────┐   ┌─────────────────────┐                      │
│  │ wclaw (Web UI)  │   │ cclaw (Remote Agent)│                      │
│  │ Chat Interface  │   │ WebSocket Remote   │                      │
│  │ Session Mgmt    │◄──►│ Command Execution  │                      │
│  │ File Display    │   │ Status Monitor     │                      │
│  │ Settings/Fav.   │   │ Heartbeat Keepalive│                      │
│  └─────────────────┘   └─────────────────────┘                      │
└───────────────────────────────────────────────────────────────────────┘
```

### Component Overview

| Component | Path | Role | Responsibilities |
|-----------|------|------|-----------------|
| 🧠 **xCrab** | `./xCrab/` | AI Engine | LLM calls (MiniMax/DeepSeek), conversation context, tool/skill execution, Gateway HTTP service |
| 📡 **eclaw** | `./xCrab/eclaw/` | Relay Server | HTTP API + WebSocket, user auth/registration, message routing, MySQL database management |
| 🖥️ **wclaw** | `./xCrab/wclaw/` | Web UI | Chat interface, session management, message display, file views, favorites, model switching |
| 🤖 **cclaw** | `./xCrab/cclaw/` | Remote Agent | WebSocket connection to server, remote command execution, status monitoring, heartbeat keepalive |

---

## 🚀 Quick Start

### 📋 Prerequisites

| Environment | Requirement |
|-------------|-------------|
| **Node.js** | **v22.12 or higher** |
| **npm** | Bundled with Node.js |
| **MySQL** | **8.0+** (must be installed and running) |
| **OS** | Windows 10+ / Ubuntu 20.04+ / macOS |

---

## 🗄️ Database Setup (Required)

eclaw (Relay Server) **requires MySQL** to store user accounts, chat history, favorites, and feedback.

### 1️⃣ Install MySQL

**Windows:**
1. Download MySQL Installer from [dev.mysql.com](https://dev.mysql.com/downloads/installer/)
2. Set a **root password** during installation (remember it!)
3. Note the MySQL port (default `3306`)

**Ubuntu/Debian:**
```bash
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

### 2️⃣ Create Database

Connect to MySQL and create the database. The app will also try to auto-create it on startup, but manual creation is recommended:

```bash
mysql -u root -p
```

At the MySQL prompt:
```sql
CREATE DATABASE IF NOT EXISTS wclaw_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Or via one-liner:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS wclaw_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3️⃣ Configure Database Connection

Edit `xCrab/.env` (refer to `xCrab/.env.example`) to set your database credentials:

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `DB_HOST` | `127.0.0.1` | ❌ | MySQL host (keep default for local) |
| `DB_PORT` | `3306` | ❌ | MySQL port |
| `DB_USER` | `root` | ❌ | Database username |
| `DB_PASS` | (empty) | ✅ | **Your MySQL password** |
| `DB_NAME` | `wclaw_db` | ❌ | Database name |

> ⚠️ **Important:** The default values `DB_USER=wclaw_db` and `DB_PASS=100911yzpYZP` in the source code are **example values only**. You MUST replace them with **your own** database credentials. Do NOT use the example values in production.

### 4️⃣ Auto Table Creation

On first startup, the application will automatically detect and create the following tables (no manual SQL required):

| Table | Purpose |
|-------|---------|
| `users` | User accounts, passwords, phone numbers |
| `history` | Chat history |
| `feedbacks` | User feedback |
| `favorites` | Bookmarks/favorites |
| `notifications` | System notifications |

---

## 🪟 Windows Deployment

### 1️⃣ Install Node.js

**Method 1 (Recommended):** Download **v22.x LTS** from [nodejs.org](https://nodejs.org), run installer (check "Add to PATH").

**Method 2: winget**
```bash
winget install OpenJS.NodeJS.LTS
```

Verify:
```bash
node -v    # Should show v22.x.x
npm -v     # Should show 10.x.x
```

### 2️⃣ Clone Repository

```bash
git clone https://github.com/yzp100911/OpenCrab.git
cd OpenCrab
```

### 3️⃣ Install Dependencies

```bash
cd xCrab
npm install
```

If `better-sqlite3` fails to compile, install **Visual Studio Build Tools** (with C++ tools), or run:
```bash
npm install better-sqlite3 --force
```

### 4️⃣ Configure Environment

```bash
copy .env.example .env
```

Open `xCrab/.env` with Notepad or VS Code, fill in these **required** fields:

| Variable | Required | Description |
|----------|----------|-------------|
| `MINIMAX_API_KEY` | ✅ **Required** | MiniMax API key ([Get one](https://platform.minimaxi.com)) |
| `DEEPSEEK_API_KEY` | ❌ Optional | DeepSeek API key |
| `DB_PASS` | ✅ **Required** | **Your** MySQL password |

### 5️⃣ Start Services

**Option A: Start separately (recommended for debugging)**

```bash
# Terminal 1: Start AI Engine (xCrab Gateway)
cd xCrab
npm start

# Terminal 2: Start Relay Server (eclaw, includes web UI)
cd xCrab/eclaw
npm install
node server.js

# Terminal 3: Start Remote Agent (cclaw, optional)
cd xCrab/cclaw
npm install
node index.js
```

**Option B: One-click start**
```bash
cd xCrab
npm run start:all
```

> Once started, open **http://localhost:10090** in your browser.

---

## 🐧 Linux Deployment (Ubuntu / CentOS)

### 1️⃣ Install Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

Verify:
```bash
node -v    # Should show v22.x.x
npm -v     # Should show 10.x.x
```

### 2️⃣ Clone Repository & Install MySQL

```bash
sudo apt-get install -y git mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

git clone https://github.com/yzp100911/OpenCrab.git
cd OpenCrab
```

### 3️⃣ Create Database

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS wclaw_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4️⃣ Install Dependencies & Configure

```bash
cd xCrab
npm install
cp .env.example .env
nano .env   # Fill in API keys and DB password
```

### 5️⃣ Start Services

```bash
# AI Engine
cd xCrab && npm start &

# Relay Server (includes web UI)
cd xCrab/eclaw && node server.js &

# One-click start
cd xCrab && npm run start:all
```

> Open **http://your-server-ip:10090** in a browser to access the web UI.

### 6️⃣ ★ Systemd Auto-start

Below are systemd service files for all three components. **Replace `/path/to/OpenCrab` with your actual deployment path.**

```bash
# 🧠 xCrab AI Engine
sudo tee /etc/systemd/system/xcrab.service > /dev/null << 'EOF'
[Unit]
Description=xCrab AI Engine
After=network.target mysql.service
Requires=mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/OpenCrab/xCrab
ExecStart=/usr/bin/node /path/to/OpenCrab/xCrab/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 📡 eclaw Relay Server (includes web UI)
sudo tee /etc/systemd/system/eclaw.service > /dev/null << 'EOF'
[Unit]
Description=Eclaw Service (WebSocket + API)
After=network.target mysql.service
Requires=mysql.service

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/OpenCrab/xCrab/eclaw
ExecStart=/usr/bin/node /path/to/OpenCrab/xCrab/eclaw/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 🤖 cclaw Remote Agent (optional, for remote execution)
sudo tee /etc/systemd/system/cclaw.service > /dev/null << 'EOF'
[Unit]
Description=Cclaw Client (Remote Execution)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/OpenCrab/xCrab/cclaw
ExecStart=/usr/bin/node /path/to/OpenCrab/xCrab/cclaw/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Reload and start
sudo systemctl daemon-reload
sudo systemctl enable xcrab eclaw cclaw
sudo systemctl start xcrab eclaw
```

---

## ⚙️ Environment Variables Reference

### 🧠 xCrab AI Engine

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `MINIMAX_API_KEY` | - | ✅ | MiniMax API key ([Get one](https://platform.minimaxi.com)) |
| `MINIMAX_BASE_URL` | `https://api.minimaxi.com/v1` | ❌ | MiniMax API base URL |
| `DEEPSEEK_API_KEY` | - | ❌ | DeepSeek API key |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | ❌ | DeepSeek API base URL |
| `MODEL` | `MiniMax-M2.7` | ❌ | Model to use |
| `ENABLE_MEMORY` | `false` | ❌ | Enable persistent memory |
| `GATEWAY_PORT` | `3000` | ❌ | xCrab Gateway HTTP port |

### 📡 eclaw Relay Server

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `ECLAW_PORT` | `10090` | ❌ | Server listen port (web UI access port) |
| `DB_HOST` | `127.0.0.1` | ❌ | MySQL host |
| `DB_PORT` | `3306` | ❌ | MySQL port |
| `DB_USER` | `root` | ❌ | Database username |
| `DB_PASS` | (empty) | ✅ | **Your MySQL password** |
| `DB_NAME` | `wclaw_db` | ❌ | Database name |
| `XCRAB_API_URL` | `http://localhost:3000` | ❌ | xCrab Gateway URL |
| `XCRAB_TOKEN` | - | ❌ | xCrab auth token |

### 🤖 cclaw Remote Agent

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `ECLAW_API_URL` | `http://127.0.0.1:10090` | ✅ | eclaw server HTTP URL |
| `ECLAW_WS_URL` | `ws://127.0.0.1:10090/ws` | ✅ | eclaw server WebSocket URL |
| `CCLAW_USERNAME` | `ad1009` | ❌ | Agent login username (must be registered in eclaw) |

---

## 📁 Project Structure

```
OpenCrab/
├── README.md                   # This file (Chinese)
├── README_EN.md                # This file (English)
├── .gitignore
├── LICENSE
│
└── xCrab/                      # 🧠 AI Engine (main directory)
    ├── index.js                # Entry point
    ├── package.json            # Dependencies
    ├── .env.example            # Environment template
    ├── .env                    # Environment config (create from template)
    │
    ├── src/                    # 🧠 AI Core Source
    │   ├── cli.js              # CLI interaction
    │   ├── llm.js              # LLM calls (MiniMax/DeepSeek)
    │   ├── tools.js            # Tool function registry
    │   ├── skill-manager.js    # Skill manager
    │   ├── gateway/            # HTTP API Gateway
    │   │   ├── server.js       # Gateway service
    │   │   ├── api-handler.js  # API handler
    │   │   ├── llm-stream.js   # Streaming LLM response
    │   │   └── frontend/       # xCrab built-in frontend
    │   ├── config.js           # Configuration
    │   ├── history.js          # Conversation history
    │   ├── planner.js          # Task planner
    │   └── mcp/                # MCP protocol client
    │
    ├── skills/                 # 🧠 Skill modules
    ├── tests/                  # 🧠 Tests
    │
    ├── eclaw/                  # 📡 Relay Server
    │   ├── server.js           # Server entry (API + WebSocket)
    │   ├── cloud-sync.js       # Database config module
    │   ├── package.json        # Dependencies (express, mysql2, ws)
    │   └── users.json          # Local user cache
    │
    ├── wclaw/                  # 🖥️ Web UI
    │   ├── index.html          # Main page
    │   ├── app.js              # Frontend entry
    │   ├── app-base.js         # Base logic
    │   ├── app-auth.js         # Auth
    │   ├── app-main.js         # Main logic
    │   ├── styles.css          # Styles
    │   └── icon/               # Icons
    │
    ├── cclaw/                  # 🤖 Remote Agent
    │   ├── index.js            # Agent entry
    │   ├── status-monitor.js   # Status monitor
    │   ├── package.json        # Dependencies
    │   └── data/               # Agent configuration
    │
    ├── data/                   # AI runtime data
    └── uploads/                # File upload directory
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| MySQL connection: `ECONNREFUSED` | Check MySQL is running: `systemctl status mysql` |
| MySQL connection: `ER_ACCESS_DENIED_ERROR` | Verify `DB_USER` and `DB_PASS` in `.env` |
| MySQL connection: `ER_BAD_DB_ERROR` | Create the database first: `mysql -u root -p -e "CREATE DATABASE wclaw_db"` |
| MiniMax API returns 401 | Check `MINIMAX_API_KEY` is correct |
| Web UI returns 404 | Verify static file path in `eclaw/server.js` points to `../wclaw/` |
| Port in use | Change `ECLAW_PORT` or `GATEWAY_PORT` in `.env` |
| `better-sqlite3` install fails | Install build-essential (Linux) or VS Build Tools (Windows) |

### Get API Keys

- **MiniMax API**: Register at [https://platform.minimaxi.com](https://platform.minimaxi.com)
- **DeepSeek API** (optional): Register at [https://platform.deepseek.com](https://platform.deepseek.com)

---

## 📝 License

MIT
# ⚠️ Brand Statement

> **OpenCrab is an independent open-source project. It is NOT affiliated with, endorsed by, or connected to OpenClaw (openclaw.ai) or any related projects.**

---

## 📌 Independent Statement

OpenCrab is a **multi-model AI gateway** independently developed and maintained by the open-source community. It is a separate project from **OpenClaw** (openclaw.ai) and has no organizational, technical, or marketing affiliation with the OpenClaw team.

**Key Differences:**

| Item | OpenCrab | OpenClaw |
|------|----------|----------|
| **Type** | Multi-model AI Gateway | AI Personal Assistant |
| **Focus** | Model aggregation & routing | Autonomous task execution |
| **Models** | MiniMax, DeepSeek, etc. | Claude, GPT, Gemini, etc. |
| **License** | MIT | MIT |
| **Maintainer** | Community | openclaw team |

---

## 📌 Project Positioning

OpenCrab is designed as a **lightweight, high-performance AI gateway framework** that:

- Provides unified API access to multiple LLM providers
- Supports MiniMax, DeepSeek, and other mainstream models
- Offers flexible routing and load balancing
- Enables easy extension for new models

Our mission is to make AI model integration simpler and more accessible.

---

## 🦀 Naming Origin

The name **"Crab"** is inspired by the creature's characteristics:

- **Multi-tasking**: Crabs can move in multiple directions simultaneously, just like OpenCrab routing requests across different AI models
- **Resilience**: Hard shell, adaptable nature — reflecting the project's robustness
- **Community-driven**: Like crabs living in colonies, OpenCrab grows with community contributions

The "x" prefix follows the Unix naming convention (e.g., `xorg`, `xref`), while "Crab" represents the project's identity. This naming has no relation to OpenClaw's branding or the "Claw" terminology.

---

## ⚖️ Trademark Disclaimer

- **OpenCrab**™ is used to identify our open-source project only
- This trademark does not grant any rights to use the name in commercial products or services
- Any similarity to other trademarks is coincidental
- Users of this software assume all responsibilities for their own compliance with applicable laws and regulations

---

## 🤝 Contribution & Contact

OpenCrab is an open-source project licensed under MIT. We welcome contributions from developers worldwide.

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yzp100911/OpenCrab/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yzp100911/OpenCrab/discussions)
- 📖 **Documentation**: Pull requests welcome
- ⭐ **Star & Share**: Your support motivates us

---

*This statement was last updated: $(date +%Y-%m-%d)*