# xCrab Agent

> 🦞 xCrab Agent — 多模型 AI 个人助手，基于 Node.js 构建，支持 MiniMax、DeepSeek 等主流模型

[![GPL-3.0 License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Node.js v22+](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)

## 功能特性

- **多模型网关** — 支持 MiniMax、DeepSeek 等主流 LLM 模型切换，一个入口统一管理
- **MCP 协议支持** — 可接入 Model Context Protocol 服务器，扩展工具能力
- **技能系统** — 插件化 Skill 管理，自动加载自定义技能
- **记忆系统** — SQLite 本地持久化记忆，跨会话保持上下文
- **统计追踪** — Token 用量统计与计费管理
- **Web 控制台** — 内置 HTTP 服务，提供网页前端查看状态、切换模型、浏览历史

## 快速开始

### 环境要求

- Node.js v22+
- npm 或 pnpm

### 安装

```bash
git clone https://github.com/yzp100911/xCrab.git
cd xCrab
npm install
```

### 配置

复制 `.env.example` 为 `.env`，填入你的 API Key：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
MINIMAX_API_KEY=your_api_key_here
DEEPSEEK_API_KEY=your_api_key_here
```

### 运行

```bash
npm start
```

### Docker 部署

```bash
docker-compose up -d
```

## 项目结构

```
xCrab/
├── index.js              # 入口文件
├── src/
│   ├── gateway/         # HTTP 网关 + Web 前端
│   ├── llm.js           # LLM 调用封装
│   ├── skill-manager.js # 技能管理系统
│   ├── memory/          # 记忆存储
│   ├── mcp/             # MCP 客户端
│   ├── workspace/       # 工作区管理
│   └── stats/           # 统计追踪
├── skills/              # 自定义技能目录
├── mcp-servers/         # MCP 服务器配置
└── data/                # 数据目录（数据库、记忆等）
```

## Gateway API

启动后访问 `http://localhost:3000` 打开 Web 控制台。

### 请求示例

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_auth_token" \
  -d '{"messages":[{"role":"user","content":"Hello!"}]}'
```

## 开源协议

本项目采用 [GPL-3.0](LICENSE) 开源协议。

---

🦞 xCrab Agent — 让 AI 助手更简单