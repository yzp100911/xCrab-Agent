🦀 skillgate-agent

**skillgate-agent** — AI Personal Assistant Suite, containing four core components: **xCrab (AI Execution Engine)**, **eclaw (Service Dispatcher)**, **cclaw (Remote Distributor)**, and **wclaw (Web Client)**.

Download one repository, deploy completely.

---

## ⚠️ Brand Statement

**skillgate-agent** is an independent Chinese open-source project with no affiliation, derivation, authorization, or sponsorship relationship with [OpenClaw](https://github.com/openclaw/openclaw) (open-source AI agent framework).

### Project Focus

skillgate-agent is a **multi-model AI gateway** focused on:
- Model aggregation and routing
- Unified API access
- High-speed, low-latency forwarding services
- Support for domestic mainstream models like MiniMax and DeepSeek

### Naming Origin

- **"Crab"** represents a crab — symbolizing efficiency, speed, and lateral movement
- The overall naming follows common animal-based naming conventions in the open-source community (like TensorFlow, Camel, etc.), with no intention to imitate or confuse any existing brand

### Trademark Statement

1. The project name and related identifiers of skillgate-agent are independently created by the project author
2. If you need to use skillgate-agent code or name in commercial products, please evaluate and bear the relevant legal responsibilities yourself
3. The project author is not responsible for any trademark or intellectual property disputes caused by using this project

### Contact

For any brand-related issues, please contact the project maintainer via GitHub Issues.

---

## 📦 System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          skillgate-agent (this repo)                │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │          xCrab (AI Execution Engine)                         │   │
│  │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │   │
│  │   │ LLM Calls     │   │ Tools/Skills │   │ MCP Client   │   │   │
│  │   │ MiniMax       │   │ Registry     │   │ Ext Comms    │   │   │
│  │   │ DeepSeek      │   │ Skills       │   │              │   │   │
│  │   └──────────────┘   └──────────────┘   └──────────────┘   │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            │                                        │
│                            ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │             eclaw (Service Dispatcher)                       │   │
│  │   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │   │
│  │   │ HTTP API     │   │ WebSocket    │   │ MySQL DB     │   │   │
│  │   │ Routing/Auth │   │ Msg Forward  │   │ User/History │   │   │
│  │   │              │   │              │   │ Fav/Feedback │   │   │
│  │   └──────────────┘   └──────────────┘   └──────────────┘   │   │
│  └─────┬─────────────────────────┬────────────────────────────┘   │
│        │                         │                                │
│        ▼                         ▼                                │
│  ┌─────────────────┐   ┌─────────────────────┐                    │
│  │ wclaw (Web UI)  │   │ cclaw (Distributor) │                    │
│  │ Chat UI         │   │ WebSocket Remote    │                    │
│  │ Session Mgmt    │◄──►│ Command Execution  │                    │
│  │ File Display    │   │ Status Monitoring   │                    │
│  │ Settings/Fav    │   │ Heartbeat Keep-alive│                    │
│  └─────────────────┘   └─────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 📋 Requirements

| Environment | Requirement |
|-------------|-------------|
| **Node.js** | **v22.12 or higher** |
| **npm** | Bundled with Node.js |
| **MySQL** | **8.0+** (must be installed and running) |
| **OS** | Windows 10+ / Ubuntu 20.04+ / macOS |

---

## 🪟 Windows Deployment (Simplified)

```bash
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent
cd xCrab
npm install

# Configure .env (fill in API_KEY and DB_PASS)
copy .env.example .env

# Start (three terminals)
cd xCrab && npm start                              # AI Execution Engine
cd xCrab/eclaw && node server.js                   # Service Dispatcher
# Visit http://localhost:10090
```

---

## ⚙️ Core Environment Variables

### xCrab AI Execution Engine

| Variable | Required | Description |
|----------|----------|-------------|
| `MINIMAX_API_KEY` | ✅ | MiniMax API Key |
| `DEEPSEEK_API_KEY` | ❌ | DeepSeek API Key |

### eclaw Service Dispatcher

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `ECLAW_PORT` | `10090` | ❌ | Web access port |
| `DB_PASS` | — | ✅ | **Your MySQL password** |

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **Multi-Model Support** | Integrated MiniMax, DeepSeek and other mainstream LLMs with unified API |
| 🔌 **Skills Extension** | MCP protocol support, plugin-based architecture |
| 🌐 **Web Client** | Access directly via browser, no installation needed |
| 💾 **Session Management** | History, favorites, feedback mechanism |
| 🔒 **Secure & Reliable** | API authentication, command execution control |

---

## 📂 Project Structure

```
skillgate-agent/
├── xCrab/                      # AI Execution Engine
│   ├── src/
│   │   ├── core/               # Core modules
│   │   ├── skills/             # Skills modules
│   │   └── mcp/                 # MCP client
│   ├── eclaw/                  # Service Dispatcher
│   │   └── server.js           # API service
│   ├── cclaw/                  # Remote Distributor
│   └── wclaw/                  # Web Client
│
├── README.md
└── README_EN.md
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [MiniMax](https://www.minimaxi.com/) — API support
- [DeepSeek](https://deepseek.com/) — API support
- [MCP](https://modelcontextprotocol.github.io/) — Open standard protocol
- All open-source contributors

---

<p align="center">
  <strong>skillgate-agent</strong> — Making AI assistants accessible
</p>