# ===== Stage 1: Build =====
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# ===== Stage 2: Production =====
FROM node:22-alpine

WORKDIR /app

# 安装 better-sqlite3 所需的构建依赖
RUN apk add --no-cache python3 make g++

COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
COPY src/ ./src/
COPY mcp-servers/ ./mcp-servers/ 2>/dev/null || true

# 创建数据目录
RUN mkdir -p /app/data/memory /app/data/canvas /app/data/stats

# 默认非 root 用户运行
USER node

ENV NODE_ENV=production

EXPOSE 3000

# 默认启动 CLI（可通过 docker run 覆盖为 node）
CMD ["node", "index.js"]
