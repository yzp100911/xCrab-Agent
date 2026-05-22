[🇨🇳 中文](README.md) | [🇬🇧 English]

# xCrab-Agent 🦀

**xCrab** — A compact AI personal assistant, a multi-model AI gateway powered by MiniMax and DeepSeek, supporting tool calling, browser automation, and skill extensions.

---

## 📦 System Architecture

```
  xCrab-Agent (This Repo)       eclaw-server              claw-client
  ┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
  │  🧠 AI Brain     │     │  📡 Relay Server  │     │  🤖 Execution    │
  │  Dialogue Engine │◄───►│  Forwarding cmds  │◄───►│  Run commands on │
  │  Tool Calling    │     │  WebSocket Mgmt   │     │  remote server   │
  │  Skill Extension │     │  Web UI (wclaw)   │     │  node-pty term   │
  └─────────────────┘     └──────────────────┘     └──────────────────┘
```

> - [**xCrab-Agent**](https://github.com/yzp100911/xCrab-Agent) = AI Dialogue Engine (the intelligent assistant you're talking to)
> - [**eclaw-server**](https://github.com/yzp100911/eclaw-server) = Relay Server (bridge between Web UI ↔ Execution End)
> - [**claw-client**](https://github.com/yzp100911/claw-client) = Execution Terminal (runs commands on target servers)

---

## 🚀 Deployment Guide (Windows / Linux)

### 📋 Prerequisites

| Environment | Requirement | Notes |
|-------------|-------------|-------|
| **Node.js** | **v22.12 or higher** | Must be 22.12+, recommend v22.x LTS |
| **npm** | Bundled with Node.js | No additional installation needed |
| **OS** | Windows 10+ / Ubuntu 20.04+ | Tested |

---

## 🪟 Windows Deployment

### 1️⃣ Install Node.js

**Method 1 (Recommended): Download from official website**
- Visit [https://nodejs.org](https://nodejs.org) and download **v22.x LTS**
- Run the installer with default options (check "Add to PATH")
- Open **Command Prompt (cmd)** or **PowerShell**, verify:

```bash
node -v    # Should show v22.x.x
npm -v     # Should show 10.x.x
```

**Method 2: Install via winget**
```bash
winget install OpenJS.NodeJS.LTS
```

### 2️⃣ Clone the Repository

```bash
# Install Git first (https://git-scm.com/downloads/win)
git clone https://github.com/yzp100911/xCrab-Agent.git
cd xCrab-Agent
```

### 3️⃣ Install Dependencies

```bash
npm install
```

> ⚠️ **Windows Build Note**: If `better-sqlite3` fails to compile, ensure you have:
> - **Visual Studio Build Tools** (with C++ build tools)
> - Or use pre-built version: `npm install --build-from-source`
> - Or try: `npm install better-sqlite3 --force`

### 4️⃣ Configure Environment Variables

```bash
# Copy the environment template
copy .env.example .env
```

Open `.env` (with Notepad or VS Code) and fill in the required keys:

| Variable | Required | Description |
|----------|----------|-------------|
| `MINIMAX_API_KEY` | ✅ **Required** | MiniMax API key ([Get one](https://platform.minimaxi.com)) |
| `DEEPSEEK_API_KEY` | ❌ Optional | DeepSeek API key, for switching models |
| `MODEL` | ❌ Optional | Default `MiniMax-M2.7` |
| `GATEWAY_PORT` | ❌ Optional | Gateway HTTP port (default 3000) |

### 5️⃣ Start xCrab

```bash
npm start
```

Or directly:

```bash
node index.js
```

Successful startup output:
```
  🦀 xCrab v2.0.0
  Model: MiniMax-M2.7
  API: https://api.minimaxi.com/v1
  Memory: Enabled
```

---

## 🐧 Linux Deployment (Ubuntu / CentOS)

### 1️⃣ Install Node.js

**Ubuntu/Debian:**

```bash
# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v    # Should show v22.x.x
npm -v     # Should show 10.x.x
```

**CentOS/RHEL:**

```bash
# Install Node.js 22.x
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node -v
npm -v
```

### 2️⃣ Clone the Repository

```bash
# Install Git
sudo apt-get install -y git    # Ubuntu
# sudo yum install -y git      # CentOS

git clone https://github.com/yzp100911/xCrab-Agent.git
cd xCrab-Agent
```

### 3️⃣ Install Dependencies

```bash
npm install
```

> If `better-sqlite3` compilation fails, install build tools:
> ```bash
> sudo apt-get install -y build-essential python3    # Ubuntu
> # sudo yum groupinstall -y "Development Tools"     # CentOS
> ```

### 4️⃣ Configure Environment Variables

```bash
# Copy the environment template
cp .env.example .env

# Edit .env (fill in your API keys)
nano .env
```

### 5️⃣ Start xCrab

```bash
# Direct start
node index.js

# Or using npm
npm start
```

### 6️⃣ ★ Auto-start on Boot (systemd service)

```bash
# Copy service file to systemd directory
sudo cp xcrab.service /etc/systemd/system/

# Modify paths in the service file if needed
# sudo nano /etc/systemd/system/xcrab.service
# Update WorkingDirectory and ExecStart to your actual paths

# Reload systemd
sudo systemctl daemon-reload

# Enable and start the service
sudo systemctl enable xcrab
sudo systemctl start xcrab

# Check service status
sudo systemctl status xcrab

# View real-time logs
sudo journalctl -u xcrab -f
```

---

## ⚙️ Environment Variables Reference

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `MINIMAX_API_KEY` | - | ✅ | MiniMax API key |
| `MINIMAX_BASE_URL` | `https://api.minimaxi.com/v1` | ❌ | MiniMax API base URL |
| `DEEPSEEK_API_KEY` | - | ❌ | DeepSeek API key (optional) |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com/v1` | ❌ | DeepSeek API base URL |
| `MODEL` | `MiniMax-M2.7` | ❌ | Model to use |
| `ENABLE_MEMORY` | `false` | ❌ | Enable persistent memory |
| `MEMORY_DB_PATH` | `./memory/memories.db` | ❌ | Memory database path |
| `MEMORY_AUTO_SUMMARY` | `true` | ❌ | Auto-save conversation summaries |
| `GATEWAY_ENABLED` | `false` | ❌ | Enable Gateway HTTP service |
| `GATEWAY_PORT` | `3000` | ❌ | Gateway service port |
| `GATEWAY_JWT_SECRET` | - | ❌ | Gateway JWT secret |
| `GATEWAY_TOKEN` | - | ❌ | Gateway static token |
| `MCP_SERVERS` | `[]` | ❌ | MCP server configuration (JSON) |
| `WORKSPACE_DIR` | `./data` | ❌ | Workspace root directory |
| `ACTIVE_WORKSPACE` | `main` | ❌ | Default active workspace |

---

## 📁 Project Structure

```
xCrab-Agent/
├── index.js              # Entry point (use this to start)
├── package.json          # Dependencies config
├── .env                  # Environment config (copy from .env.example)
├── .env.example          # Environment variable template
│
├── src/                  # Core source code
│   ├── config.js         # Config loader
│   ├── llm.js            # LLM invocation
│   ├── tools.js          # Tool function registry
│   ├── cli.js            # Command-line interaction
│   └── skill-manager.js  # Skill manager
│
├── gateway/              # HTTP API Gateway
│   └── server.js
│
├── memory/               # SQLite memory system
│   └── store.js
│
├── mcp/                  # MCP protocol client
│   └── client.js
│
├── stats/                # Statistics tracking
│   ├── tracker.js
│   └── quota-tracker.js
│
├── workspace/            # Workspace management
│   └── manager.js
│
├── hooks/                # Lifecycle hooks
│   └── registry.js
│
├── skills/               # Skill modules (installed from marketplace)
├── tools/                # Tool function directory
├── tests/                # Test files
├── data/                 # Workspace data directory
├── mcp-servers/          # MCP server directory
├── xcrab.service         # Linux systemd service file
└── README.md             # This file
```

---

## 🔧 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| `MINIMAX_API_KEY` not configured | Check that `.env.example` has been copied to `.env` and the key is filled in |
| `better-sqlite3` install failure | Install `build-essential` (Linux) or Visual Studio Build Tools (Windows) |
| Port already in use | Change `GATEWAY_PORT` in `.env` or close the program using the port |
| Module not found | Run `npm install` to reinstall dependencies |

### Get API Keys

- **MiniMax API**: Register at [https://platform.minimaxi.com](https://platform.minimaxi.com)
- **DeepSeek API** (optional): Register at [https://platform.deepseek.com](https://platform.deepseek.com)

---

## 📝 License

MIT
