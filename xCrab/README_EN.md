# 🦀 xCrab - AI Assistant

An AI intelligent assistant powered by MiniMax-M2.7 model with extensible skill system.

## Features

- 🤖 AI Chat (MiniMax-M2.7 model)
- 🔧 Extensible Skill System
- 🌐 Gateway API Service
- 📊 Monitoring & Statistics

## Requirements

- Node.js >= 18.0.0
- MySQL 5.7+ or MariaDB 10.3+
- Linux Server (Ubuntu 20.04+ recommended)

## Quick Deployment

### Method 1: Using an Overseas Server (for GitHub Access)

If your local network cannot access GitHub (e.g., mainland China), use an overseas server to deploy:

```bash
# 1. Install Node.js 18+ on the overseas server
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install MySQL
sudo apt-get install -y mysql-server

# 3. Clone the project (from overseas server with GitHub access)
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent/xCrab

# 4. Install dependencies
npm install

# 5. Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# 6. Initialize database
mysql -u root -p < src/sql/schema.sql

# 7. Start the service
npm run start
# Or use PM2
npm install -g pm2
pm2 start dist/index.js --name xcrab
```

### Method 2: Direct Deployment

If your network can access GitHub normally:

```bash
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent/xCrab
npm install
cp .env.example .env
# Edit .env with your configuration
mysql -u root -p < src/sql/schema.sql
pm2 start dist/index.js --name xcrab
```

## Configuration

### Environment Variables (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Service port | `60016` |
| `MINIMAX_API_KEY` | Yes | MiniMax API Key | `sk-xxx` |
| `MINIMAX_MODEL` | No | Model name, default `MiniMax-M2.7` | `MiniMax-M2.7` |
| `MINIMAX_BASE_URL` | No | API URL | `https://api.minimaxi.com/anthropic` |
| `MYSQL_HOST` | No | MySQL host | `localhost` |
| `MYSQL_PORT` | No | MySQL port | `3306` |
| `MYSQL_USER` | Yes | MySQL username | `root` |
| `MYSQL_PASSWORD` | Yes | MySQL password | `your_password` |
| `MYSQL_DATABASE` | No | Database name | `wclaw_db` |

### Port Reference

- **60016**: Gateway service port (HTTP)
- **3306**: MySQL database port

Make sure these ports are open in your firewall.

## Database Setup

### Install MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mysql-server

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Initialize Database

```bash
# Login to MySQL
sudo mysql -u root

# Create database and user (adjust password as needed)
CREATE DATABASE wclaw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u root -p wclaw_db < src/sql/schema.sql
```

### ⚠️ Common Issue: MySQL Authentication Error

If you encounter:
```
Authentication plugin 'caching_sha2_password' cannot be used
```

Solution:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

## Managing Services with PM2

```bash
# Install PM2
npm install -g pm2

# Start service
pm2 start dist/index.js --name xcrab

# Check status
pm2 status

# View logs
pm2 logs xcrab

# Restart service
pm2 restart xcrab

# Stop service
pm2 stop xcrab
```

## Health Check

After deployment, verify service status:

```bash
# Check PM2 status
pm2 status

# Test health endpoint
curl http://localhost:60016/health

# Expected response
{"status":"ok","timestamp":"2026-01-01T00:00:00.000Z","uptime":123.45}
```

## Project Structure

```
skillgate-agent/
├── xCrab/
│   ├── src/
│   │   ├── index.js          # Main entry
│   │   ├── gateway.js        # Gateway service
│   │   ├── agent.js          # Agent core
│   │   ├── eclaw.js          # Eclaw integration
│   │   ├── sql/
│   │   │   └── schema.sql    # Database schema
│   │   └── skills/           # Skills directory
│   ├── .env.example          # Environment example
│   ├── package.json
│   └── README.md
└── README.md
```

## Troubleshooting

### Service Won't Start

1. Check if port is occupied:
   ```bash
   lsof -i :60016
   ```

2. Verify Node.js version:
   ```bash
   node --version  # needs >= 18.0.0
   ```

3. Check PM2 logs:
   ```bash
   pm2 logs xcrab
   ```

### Database Connection Failed

1. Confirm MySQL is running:
   ```bash
   sudo systemctl status mysql
   ```

2. Test database connection:
   ```bash
   mysql -u root -p -h localhost
   ```

3. Verify .env database configuration.

### Network Access Issues

If service is inaccessible externally:

1. Check firewall settings:
   ```bash
   sudo ufw allow 60016
   ```

2. Ensure service binds to 0.0.0.0 (not 127.0.0.1).

## Support

- GitHub Issues: https://github.com/yzp100911/skillgate-agent/issues

## License

MIT License