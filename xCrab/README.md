# 🦀 xCrab - 智能助手

基于 MiniMax-M2.7 模型的 AI 智能助手，支持多技能扩展。

## 功能特点

- 🤖 AI 对话能力（MiniMax-M2.7 模型）
- 🔧 技能系统扩展（浏览器自动化、翻译、天气查询等）
- 🌐 Gateway API 服务（REST + SSE 流式响应）
- 💾 记忆系统（对话历史存储与检索）
- 📊 监控与统计（调用次数、配额追踪）
- 🔐 Token 认证保护

## 环境要求

- Node.js >= 18.0.0
- MySQL 5.7+ 或 MariaDB 10.3+（可选，用于记忆系统）
- Linux 服务器（推荐 Ubuntu 20.04+）
- PM2 进程管理器

## 快速部署

### 一键部署

```bash
# 1. 克隆仓库
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent

# 2. 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 手动部署

```bash
# 1. 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 MySQL（可选）
sudo apt-get install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 3. 安装 PM2
npm install -g pm2

# 4. 克隆项目
git clone https://github.com/yzp100911/skillgate-agent.git
cd skillgate-agent/xCrab

# 5. 安装依赖
npm install

# 6. 配置环境变量
cp .env.example .env
nano .env

# 7. 启动服务
chmod +x start.sh
./start.sh

# 8. 验证服务
curl http://localhost:60016/health
```

## 配置说明

### 环境变量 (.env)

| 变量名 | 必填 | 说明 | 默认值 |
|--------|------|------|--------|
| MINIMAX_API_KEY | ✅ | MiniMax API Key | - |
| AUTH_TOKEN | ✅ | API 访问令牌 | - |
| PORT | ❌ | 服务端口 | 60016 |
| MINIMAX_MODEL | ❌ | 模型名称 | MiniMax-M2.7 |
| MINIMAX_BASE_URL | ❌ | API 地址 | https://api.minimaxi.com/v1 |
| ENABLE_MEMORY | ❌ | 启用记忆系统 | true |
| GATEWAY_ENABLED | ❌ | 启用 Gateway | true |
| GATEWAY_TOKEN | ❌ | Gateway 令牌 | - |

## MySQL 配置（可选）

```bash
# 安装 MySQL
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 配置认证（解决 caching_sha2_password 问题）
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password'; FLUSH PRIVILEGES;"

# 创建数据库（表会自动创建）
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS wclaw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

> ⚠️ **注意**：MySQL 8.0+ 默认使用 `caching_sha2_password` 认证插件，部分 Node.js 客户端不支持。需改为 `mysql_native_password` 方式。

## 健康检查

```bash
curl http://localhost:60016/health
# 返回: {"status":"ok","timestamp":"...","uptime":...}
```

## 服务管理

```bash
pm2 start ecosystem.config.cjs   # 启动
pm2 status                        # 查看状态
pm2 logs xcrab                    # 查看日志
pm2 restart xcrab                 # 重启
pm2 stop xcrab                    # 停止
pm2 delete xcrab                  # 删除进程
pm2 startup                       # 设置开机自启
```

## API 使用

```bash
curl -X POST http://localhost:60016/api/chat \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"你好"}'
```

## 故障排查

### 1. MySQL 认证失败
```
Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol
```
**原因**：MySQL 8.0+ 默认认证插件是 `caching_sha2_password`，Node.js 客户端不支持。

**解决**：
```bash
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password'; FLUSH PRIVILEGES;"
```

### 2. 端口被占用
```
Error: listen EADDRINUSE :::60016
```
**解决**：
```bash
lsof -i :60016   # 查找占用进程
pm2 restart xcrab
```

### 3. 服务无法启动
```bash
pm2 logs xcrab --lines 50   # 查看详细日志
node -v                      # 检查版本，需要 >= 18.0.0
npm install                  # 重新安装依赖
```

## 项目结构

```
xCrab/
├── index.js                 # 主入口
├── src/                     # 核心源码
│   ├── gateway/             # Gateway HTTP 服务
│   │   ├── server.js        # 服务器（含 /health 端点）
│   │   ├── auth.js          # 认证模块
│   │   └── frontend/        # Web 前端
│   ├── tools.js             # 工具函数
│   ├── memory/              # 记忆系统
│   └── stats/               # 监控统计
├── skills/                  # 技能模块
├── eclaw/                   # 服务分发器
├── cclaw/                   # 远程分发器
├── wclaw/                   # Web 客户端
├── data/                    # 数据存储
├── start.sh                 # 启动脚本
├── ecosystem.config.cjs     # PM2 配置
└── .env.example             # 环境变量模板
```

## 许可证

本项目采用 [MIT 许可证](../LICENSE) 开源。
