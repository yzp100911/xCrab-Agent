# 🦀 xCrab - 智能助手

基于 MiniMax-M2.7 模型的 AI 智能助手，支持多技能扩展。

## 功能特点

- 🤖 AI 对话能力（MiniMax-M2.7 模型）
- 🔧 技能系统扩展
- 🌐 Gateway API 服务
- 📊 监控与统计

## 环境要求

- Node.js >= 18.0.0
- MySQL 5.7+ 或 MariaDB 10.3+
- Linux 服务器（推荐 Ubuntu 20.04+）

## 快速部署

### 方式一：使用境外服务器（如需访问 GitHub）

如果您的本地网络无法访问 GitHub（如中国内地网络），请使用境外服务器（如本文档中示例的境外A服务器）进行部署：

```bash
# 1. 在境外服务器上安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 MySQL
sudo apt-get install -y mysql-server

# 3. 克隆项目（从境外服务器访问 GitHub）
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent/xCrab

# 4. 安装依赖
npm install

# 5. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的配置

# 6. 初始化数据库
mysql -u root -p < src/sql/schema.sql

# 7. 启动服务
npm run start
# 或使用 PM2
npm install -g pm2
pm2 start dist/index.js --name xcrab
```

### 方式二：直接部署

如果您的网络可以正常访问 GitHub：

```bash
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent/xCrab
npm install
cp .env.example .env
# 编辑 .env 配置
mysql -u root -p < src/sql/schema.sql
pm2 start dist/index.js --name xcrab
```

## 配置说明

### 环境变量 (.env)

| 变量名 | 必填 | 说明 | 示例 |
|--------|------|------|------|
| `PORT` | 是 | 服务端口 | `60016` |
| `MINIMAX_API_KEY` | 是 | MiniMax API Key | `sk-xxx` |
| `MINIMAX_MODEL` | 否 | 模型名称，默认 `MiniMax-M2.7` | `MiniMax-M2.7` |
| `MINIMAX_BASE_URL` | 否 | API 地址 | `https://api.minimaxi.com/anthropic` |
| `MYSQL_HOST` | 否 | MySQL 主机 | `localhost` |
| `MYSQL_PORT` | 否 | MySQL 端口 | `3306` |
| `MYSQL_USER` | 是 | MySQL 用户名 | `root` |
| `MYSQL_PASSWORD` | 是 | MySQL 密码 | `your_password` |
| `MYSQL_DATABASE` | 否 | 数据库名 | `wclaw_db` |

### 端口说明

- **60016**: Gateway 服务端口（HTTP）
- **3306**: MySQL 数据库端口

确保这些端口在防火墙中开放。

## 数据库配置

### 安装 MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mysql-server

# 启动 MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 初始化数据库

```bash
# 登录 MySQL
sudo mysql -u root

# 创建数据库和用户（根据需要调整密码）
CREATE DATABASE wclaw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
EXIT;

# 导入 schema
mysql -u root -p wclaw_db < src/sql/schema.sql
```

### ⚠️ 常见问题：MySQL 密码认证错误

如果遇到以下错误：
```
Authentication plugin 'caching_sha2_password' cannot be used
```

解决方法：
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

## 使用 PM2 管理服务

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start dist/index.js --name xcrab

# 查看状态
pm2 status

# 查看日志
pm2 logs xcrab

# 重启服务
pm2 restart xcrab

# 停止服务
pm2 stop xcrab
```

## 健康检查

部署完成后，可通过以下方式检查服务状态：

```bash
# 检查 PM2 状态
pm2 status

# 测试健康端点
curl http://localhost:60016/health

# 预期返回
{"status":"ok","timestamp":"2026-01-01T00:00:00.000Z","uptime":123.45}
```

## 目录结构

```
skillgate-agent/
├── xCrab/
│   ├── src/
│   │   ├── index.js          # 主入口
│   │   ├── gateway.js        # Gateway 服务
│   │   ├── agent.js          # Agent 核心
│   │   ├── eclaw.js          # Eclaw 集成
│   │   ├── sql/
│   │   │   └── schema.sql    # 数据库 schema
│   │   └── skills/           # 技能目录
│   ├── .env.example          # 环境变量示例
│   ├── package.json
│   └── README.md
└── README.md
```

## 故障排查

### 服务无法启动

1. 检查端口是否被占用：
   ```bash
   lsof -i :60016
   ```

2. 检查 Node.js 版本：
   ```bash
   node --version  # 需要 >= 18.0.0
   ```

3. 查看 PM2 日志：
   ```bash
   pm2 logs xcrab
   ```

### 数据库连接失败

1. 确认 MySQL 服务运行中：
   ```bash
   sudo systemctl status mysql
   ```

2. 测试数据库连接：
   ```bash
   mysql -u root -p -h localhost
   ```

3. 检查 .env 中的数据库配置是否正确。

### 网络访问问题

如果从外部无法访问服务：

1. 检查防火墙设置：
   ```bash
   sudo ufw allow 60016
   ```

2. 检查服务是否绑定到正确地址（0.0.0.0 而非 127.0.0.1）。

## 技术支持

- GitHub Issues: https://github.com/yzp100911/skillgate-agent/issues

## 许可证

MIT License