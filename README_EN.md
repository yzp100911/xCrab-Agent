[🇨🇳 中文](README.md) | [🇬🇧 English]

> ⚠️ **Attention!!!** If you find it troublesome, just ask AI to deploy it for you.

# xCrab-Agent 🦀

**xCrab** — The all-in-one AI personal assistant family, integrating the AI dialogue engine (xCrab-Agent), relay dispatch server (eclaw-server), and remote execution terminal (claw-client). **Download one repo, deploy everything.**

---

## 📦 System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   xCrab-Agent (This Repo)                 │
│                                                          │
│  ┌──────────────────┐    ┌──────────────────┐            │
│  │  📡 eclaw-server  │    │  🧠 xCrab-Agent  │            │
│  │  Relay Server     │◄──►│  AI Engine        │            │
│  │  User Auth        │    │  MiniMax/DeepSeek │            │
│  │  Message Relay    │    │  Tool Calling     │            │
│  │  File Uploads     │    │  Skill Extension  │            │
│  │  Web UI (wclaw)   │    │  Persist Memory   │            │
│  └────────┬─────────┘    └──────────────────┘            │
│           │                                               │
│           ▼                                               │
│  ┌──────────────────┐                                    │
│  │  🤖 claw-client   │                                    │
│  │  Exec Terminal    │                                    │
│  │  WebSocket Conn   │                                    │
│  │  node-pty Term    │                                    │
│  │  Cmd Execution    │                                    │
│  └──────────────────┘                                    │
└──────────────────────────────────────────────────────────┘
```

| Component | Path | Description |
|-----------|------|-------------|
| 🧠 **xCrab-Agent** | Root `./` | AI dialogue engine, connects to MiniMax/DeepSeek, supports tool calling & skill extensions |
| 📡 **eclaw-server** | [`./server/`](./server/) | Relay dispatch server, manages WebSocket connections, user auth, file service, web frontend |
| 🤖 **claw-client** | [`./client/`](./client/) | Remote execution terminal, connects to eclaw via WebSocket, runs commands on target servers |

---

## 🚀 Quick Start

### 📋 Prerequisites

| Environment | Requirement |
|-------------|-------------|
| **Node.js** | **v22.12 or higher** |
| **npm** | Bundled with Node.js |
| **OS** | Windows 10+ / Ubuntu 20.04+ |

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
git clone https://github.com/yzp100911/xCrab-Agent.git
cd xCrab-Agent
```

### 3️⃣ Install All Dependencies

```bash
# One-click install
npm run install:all

# Or simply:
npm install
```

> ⚠️ All component dependencies are unified in the root `package.json`. A single `npm install` is all you need.
>
> If `better-sqlite3` fails to compile, install **Visual Studio Build Tools** (with C++ tools), or run:
> ```bash
> npm install better-sqlite3 --force
> ```

### 4️⃣ Configure Environment

```bash
copy .env.example .env
```

Open `.env` with Notepad or VS Code, fill in required keys:

| Variable | Required | Description |
|----------|----------|-------------|
| `MINIMAX_API_KEY` | ✅ **Required** | MiniMax API key ([Get one](https://platform.minimaxi.com)) |
| `DEEPSEEK_API_KEY` | ❌ Optional | DeepSeek API key |

> If you don't need AI connectivity (relay & terminal only), you can skip the API keys for now.

### 5️⃣ Start Components

```bash
# Start AI Engine
npm start

# Start Relay Server (new terminal)
npm run start:server

# Start Execution Terminal (new terminal)
npm run start:client

# Or start everything with one command
npm run start:all
```

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

### 2️⃣ Clone Repository

```bash
sudo apt-get install -y git   # Ubuntu
# sudo yum install -y git     # CentOS

git clone https://github.com/yzp100911/xCrab-Agent.git
cd xCrab-Agent
```

### 3️⃣ Install All Dependencies

```bash
# One-click install
npm run install:all
# or bash install-all.sh
```

### 4️⃣ Configure Environment

```bash
cp .env.example .env
nano .env   # Fill in API keys
```

### 5️⃣ Start Components

```bash
# Start AI Engine
npm start

# Start Relay Server (new terminal)
npm run start:server

# Start Execution Terminal (new terminal)
npm run start:client

# Or start everything
npm run start:all
```

### 6️⃣ ★ Auto-start with systemd

**All three components have systemd service templates:**

```bash
# 🧠 xCrab-Agent systemd service
sudo tee /etc/systemd/system/xcrab-agent.service > /dev/null << 'EOF'
[Unit]
Description=xCrab-Agent AI Engine
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/xCrab-Agent
ExecStart=/usr/bin/node /path/to/xCrab-Agent/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 📡 eclaw-server systemd service
sudo tee /etc/systemd/system/eclaw-server.service > /dev/null << 'EOF'
[Unit]
Description=Eclaw-Server (Message Relay)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/xCrab-Agent/server
ExecStart=/usr/bin/node /path/to/xCrab-Agent/server/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 🤖 claw-client systemd service
sudo tee /etc/systemd/system/claw-client.service > /dev/null << 'EOF'
[Unit]
Description=Claw-Client (Remote Terminal)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/xCrab-Agent/client
ExecStart=/usr/bin/node /path/to/xCrab-Agent/client/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Reload and start
sudo systemctl daemon-reload
sudo systemctl enable xcrab-agent eclaw-server claw-client
sudo systemctl start xcrab-agent eclaw-server claw-client
```

> ⚠️ Replace `/path/to/xCrab-Agent` with your actual deployment path.

---

## ⚙️ Environment Variables Reference

### 🧠 xCrab-Agent Config

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `MINIMAX_API_KEY` | - | ✅ | MiniMax API key |
| `MINIMAX_BASE_URL` | `https://api.minimaxi.com/v1` | ❌ | MiniMax API base URL |
| `DEEPSEEK_API_KEY` | - | ❌ | DeepSeek API key |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | ❌ | DeepSeek API base URL |
| `MODEL` | `MiniMax-M2.7` | ❌ | Model to use |
| `ENABLE_MEMORY` | `false` | ❌ | Enable persistent memory |
| `GATEWAY_ENABLED` | `false` | ❌ | Enable Gateway HTTP service |
| `GATEWAY_PORT` | `3000` | ❌ | Gateway service port |
| `GATEWAY_JWT_SECRET` | - | ❌ | Gateway JWT secret |
| `GATEWAY_TOKEN` | - | ❌ | Gateway static token |

### 📡 eclaw-server Config

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `ECLAW_PORT` | `10090` | ❌ | Server listen port |
| `XCRAB_API_URL` | `http://localhost:3000` | ❌ | xCrab-Agent gateway URL |
| `XCRAB_TOKEN` | - | ❌ | Auth token |

### 🤖 claw-client Config

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `ECLAW_API_URL` | `http://127.0.0.1:10090` | ✅ | eclaw-server API URL |
| `ECLAW_WS_URL` | `ws://127.0.0.1:10090/ws` | ✅ | eclaw-server WebSocket URL |
| `CCLAW_AI_BACKEND` | `xcrab` | ❌ | AI backend (xcrab / hermes) |
| `XCRAB_GATEWAY_URL` | `http://localhost:3000` | ❌ | xCrab-Agent gateway URL |
| `XCRAB_GATEWAY_TOKEN` | - | ❌ | xCrab-Agent gateway token |

---

## 📁 Project Structure

```
xCrab-Agent/
├── index.js                   # 🧠 AI entry point
├── package.json               # Unified dependency management (all components)
├── .env                       # Environment config (copy from .env.example)
├── .env.example               # Environment variable template
├── install-all.sh             # One-click install script (Linux)
├── LICENSE                    # MIT License
│
├── src/                       # 🧠 AI core source code
│   ├── cli.js                 # CLI interaction
│   ├── llm.js                 # LLM invocation
│   ├── tools.js               # Tool function registry
│   ├── skill-manager.js       # Skill manager
│   ├── gateway/               # HTTP API Gateway
│   ├── mcp/                   # MCP protocol client
│   ├── workspace/             # Workspace management
│   └── ...
│
├── skills/                    # 🧠 Skill modules
├── tests/                     # 🧠 Test files
│
├── server/                    # 📡 eclaw-server (Relay Dispatch Server)
│   ├── server.js              # Main server entry
│   ├── package.json           # Standalone deps (CommonJS)
│   ├── cloud-sync.js          # Cloud sync
│   ├── wclaw/                 # Web frontend
│   │   ├── index.html         # Main page
│   │   ├── app.js             # Frontend entry
│   │   ├── app-base.js        # Base logic
│   │   ├── app-auth.js        # Auth
│   │   ├── app-main.js        # Main logic
│   │   ├── styles.css         # Styles
│   │   └── icon/              # Icons
│   └── README.md              # Deployment docs
│
├── client/                    # 🤖 claw-client (Remote Execution Terminal)
│   ├── index.js               # Terminal entry
│   ├── package.json           # Standalone deps (CommonJS)
│   ├── status-monitor.js      # Status monitor
│   ├── start.sh               # Startup script
│   └── README.md              # Deployment docs
│
├── data/                      # 🧠 AI runtime data
├── uploads/                   # 📡 File upload directory
├── memory/                    # 🧠 Persistent memory
│
├── client/cclaw.service       # 🤖 Terminal systemd service template
│
└── README.md                  # This file (CN/EN)
```

---



## 🗄️ MySQL Database Setup (Required for eclaw-server)

eclaw-server requires MySQL to store user accounts, favorites, chat history, and feedback.

### Step 1: Install MySQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql
```

**CentOS:**
```bash
sudo yum install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

**Windows:**
Download from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/) and follow the installer wizard.

### Step 2: Create Database

```bash
sudo mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS wclaw_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 3: Create Database User (Recommended)

```bash
sudo mysql -u root -p -e "CREATE USER 'wclaw'@'localhost' IDENTIFIED BY 'your_password';"
sudo mysql -u root -p -e "GRANT ALL PRIVILEGES ON wclaw_db.* TO 'wclaw'@'localhost';"
sudo mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### Step 4: Configure Environment Variables

Add to your `.env` file (copy from `.env.example`):

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root          # or the user you created
DB_PASS=your_password # your MySQL password
DB_NAME=wclaw_db
```

> **Note:** The server will automatically create the required tables on first startup. No manual table creation needed.

---

## 📋 Deployment Sequence

Start the components **in order**:

### 1️⃣ Start xCrab-Agent (AI Engine)
```bash
npm start
```
The AI engine listens on port 3000 by default. Verify: `curl http://localhost:3000/api/current_model`

### 2️⃣ Start eclaw-server (Relay Dispatch)
```bash
npm run start:server
```
The relay server provides:
- Web UI at http://localhost:10090
- WebSocket endpoint at ws://localhost:10090/ws
- User registration & login
- Message relay between web and terminal

### 3️⃣ Start claw-client (Execution Terminal)
```bash
npm run start:client
```
The terminal connects to eclaw-server via WebSocket and waits for commands.

### All-in-one:
```bash
npm run start:all     # Start all three components sequentially
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `MINIMAX_API_KEY` not configured | Check that `.env` is properly configured |
| `better-sqlite3` install failure | Install build-essential (Linux) or VS Build Tools (Windows) |
| Port already in use | Change `GATEWAY_PORT` or `ECLAW_PORT` in `.env` |
| WebSocket connection failed | Check `ECLAW_WS_URL` address and port |
| eclaw-server frontend not accessible | Verify `wclaw/` directory exists and static file paths are correct in `server.js` |

### Using PM2 to Manage Processes

After PM2 restarts, it may fail to properly load environment variables from `.env`, causing `[warn] API key not provided, some features may be limited`.

**Solution:** Create an `ecosystem.config.cjs` configuration file to directly specify environment variables:

```javascript
module.exports = {
  apps: [{
    name: 'xCrab-Agent',
    script: './index.js',
    instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      MINIMAX_API_KEY: 'your_complete_api_key',
      SERVER_PORT: 3000,
      AUTH_PASSWORD: 'your_auth_password'
    }
  }]
};
```

Startup commands:
```bash
pm2 start ecosystem.config.cjs
pm2 save  # Save process list
pm2 startup  # Enable auto-start on boot
```

---

### Get API Keys

- **MiniMax API**: Register at [https://platform.minimaxi.com](https://platform.minimaxi.com)
- **DeepSeek API** (optional): Register at [https://platform.deepseek.com](https://platform.deepseek.com)

---

## 📝 License

MIT
