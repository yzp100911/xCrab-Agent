# 🦀 xCrab - AI Assistant

An AI intelligent assistant powered by MiniMax-M2.7 model with extensible skill system.

## Features

- 🤖 AI Chat (MiniMax-M2.7 model)
- 🔧 Extensible Skill System (browser automation, translation, weather, etc.)
- 🌐 Gateway API Service (REST + SSE streaming)
- 💾 Memory System (session history storage and retrieval)
- 📊 Monitoring & Statistics (call counts, quota tracking)
- 🔐 Token Authentication

## Requirements

- Node.js >= 18.0.0
- MySQL 5.7+ or MariaDB 10.3+ (optional, for memory system)
- Linux Server (Ubuntu 20.04+ recommended)
- PM2 process manager

## Quick Deployment

### One-Click Deploy

```bash
# 1. Clone the repository
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent

# 2. Run deploy script
chmod +x deploy.sh
./deploy.sh
```

### Manual Deploy

```bash
# 1. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install MySQL (optional)
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 3. Install PM2
npm install -g pm2

# 4. Clone project
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent/xCrab

# 5. Install dependencies
npm install

# 6. Configure environment
cp .env.example .env
nano .env

# 7. Start service
chmod +x start.sh
./start.sh

# 8. Verify service
curl http://localhost:60016/health
```

## Configuration

### Environment Variables (.env)

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| MINIMAX_API_KEY | ✅ | MiniMax API Key | - |
| AUTH_TOKEN | ✅ | API access token | - |
| PORT | ❌ | Service port | 60016 |
| MINIMAX_MODEL | ❌ | Model name | MiniMax-M2.7 |
| MINIMAX_BASE_URL | ❌ | API URL | https://api.minimaxi.com/v1 |
| ENABLE_MEMORY | ❌ | Enable memory system | true |
| GATEWAY_ENABLED | ❌ | Enable Gateway | true |
| GATEWAY_TOKEN | ❌ | Gateway token | - |

## MySQL Setup (Optional)

```bash
# Install MySQL
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Fix authentication (caching_sha2_password issue)
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password'; FLUSH PRIVILEGES;"

# Create database (tables are created automatically)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS wclaw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

> ⚠️ **Note**: MySQL 8.0+ defaults to `caching_sha2_password` plugin, which some Node.js clients don't support. Change to `mysql_native_password` as shown above.

## Health Check

```bash
curl http://localhost:60016/health
# Returns: {"status":"ok","timestamp":"...","uptime":...}
```

## Service Management

```bash
pm2 start ecosystem.config.cjs   # Start
pm2 status                        # Check status
pm2 logs xcrab                    # View logs
pm2 restart xcrab                 # Restart
pm2 stop xcrab                    # Stop
pm2 delete xcrab                  # Delete process
pm2 startup                       # Auto-start on boot
```

## API Usage

```bash
curl -X POST http://localhost:60016/api/chat \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

## Troubleshooting

### 1. MySQL Authentication Error
```
Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol
```
**Cause**: MySQL 8.0+ uses `caching_sha2_password` by default.

**Fix**:
```bash
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password'; FLUSH PRIVILEGES;"
```

### 2. Port Already in Use
```
Error: listen EADDRINUSE :::60016
```
**Fix**:
```bash
lsof -i :60016   # Find the process
pm2 restart xcrab
```

### 3. Service Won't Start
```bash
pm2 logs xcrab --lines 50   # Check detailed logs
node -v                      # Check version, need >= 18.0.0
npm install                  # Reinstall dependencies
```

## Project Structure

```
xCrab/
├── index.js                 # Main entry
├── src/                     # Core source code
│   ├── gateway/             # Gateway HTTP service
│   │   ├── server.js        # Server (with /health endpoint)
│   │   ├── auth.js          # Auth module
│   │   └── frontend/        # Web frontend
│   ├── tools.js             # Utility functions
│   ├── memory/              # Memory system
│   └── stats/               # Monitoring & stats
├── skills/                  # Skill modules
├── eclaw/                   # Service dispatcher
├── cclaw/                   # Remote distributor
├── wclaw/                   # Web client
├── data/                    # Data storage
├── start.sh                 # Start script
├── ecosystem.config.cjs     # PM2 config
└── .env.example             # Environment template
```

## License

This project is open-sourced under the [MIT License](../LICENSE).
