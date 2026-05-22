[🇨🇳 中文](README.md) | [🇬🇧 English]

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
| 📡 **eclaw-server** | [`./eclaw/`](./eclaw) | Relay dispatch server, manages WebSocket connections, user auth, file service, web frontend |
| 🤖 **claw-client** | [`./cclaw/`](./cclaw) | Remote execution terminal, connects to eclaw via WebSocket, runs commands on target servers |

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
# Option 1: One-click install
npm run install:all

# Option 2: Manual step-by-step
npm install                        # xCrab-Agent
cd eclaw && npm install && cd ..   # eclaw-server
cd cclaw && npm install && cd ..   # claw-client
```

> ⚠️ If `better-sqlite3` fails to compile, install **Visual Studio Build Tools** (with C++ tools), or run:
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

**Start AI Engine:**
```bash
npm start
```

**Start Relay Server** (new terminal):
```bash
npm run start:eclaw
```

**Start Execution Terminal** (new terminal):
```bash
npm run start:cclaw
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
# Option 1: One-click
npm run install:all
# or bash install-all.sh

# Option 2: Manual
npm install
cd eclaw && npm install && cd ..
cd cclaw && npm install && cd ..
```

> If `better-sqlite3` fails:
> ```bash
> sudo apt-get install -y build-essential python3
> ```

### 4️⃣ Configure Environment

```bash
cp .env.example .env
nano .env   # Fill in API keys
```

### 5️⃣ Start Components

```bash
# Start AI Engine
node index.js

# Start Relay Server (new terminal)
node eclaw/server.js

# Start Execution Terminal (new terminal)
node cclaw/index.js
```

### 6️⃣ ★ Auto-start with systemd

**All components have systemd service files:**

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

> ⚠️ Remember to update `WorkingDirectory` and `ExecStart` paths in `.service` files to your actual deployment path.

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
├── package.json               # Root dependencies
├── .env                       # Environment config (copy from .env.example)
├── .env.example               # Environment variable template
├── install-all.sh             # One-click install script (Linux)
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
├── eclaw/                     # 📡 Relay dispatch server
│   ├── server.js              # Main server entry
│   ├── package.json           # Dependencies (CommonJS)
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
├── cclaw/                     # 🤖 Remote execution terminal
│   ├── index.js               # Terminal entry
│   ├── package.json           # Dependencies (CommonJS)
│   ├── status-monitor.js      # Status monitor
│   ├── send_hello.py          # Send greeting
│   ├── start.sh               # Startup script
│   ├── .playwright-cli/       # Playwright CLI
│   └── README.md              # Deployment docs
│
├── xcrab.service              # 🧠 AI systemd service file
├── eclaw/eclaw.service        # 📡 Relay systemd service file
├── cclaw/cclaw.service        # 🤖 Terminal systemd service file
│
├── uploads/                   # File upload directory
└── README.md                  # This file (CN/EN)
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

### Get API Keys

- **MiniMax API**: Register at [https://platform.minimaxi.com](https://platform.minimaxi.com)
- **DeepSeek API** (optional): Register at [https://platform.deepseek.com](https://platform.deepseek.com)

---

## 📝 License

MIT
