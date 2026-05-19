/**
 * MCP (Model Context Protocol) 客户端
 * 支持连接多个 MCP 服务器，以 JSON-RPC 2.0 over stdio 通信
 */

import { spawn } from 'node:child_process';

export class MCPClient {
  constructor(serverId) {
    this.serverId = serverId;
    this._process = null;
    this._requestId = 0;
    this._pending = new Map();
    this._buffer = '';
    this._initialized = false;
  }

  async connect(config) {
    const { command, args = [] } = config;

    this._process = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    this._process.stdout.on('data', (data) => {
      this._buffer += data.toString();
      this._processLines();
    });

    this._process.stderr.on('data', () => {
      // MCP 服务器可能将日志输出到 stderr，忽略
    });

    this._process.on('exit', (code) => {
      this._rejectAll(`进程已退出 (code: ${code})`);
      this._initialized = false;
    });

    this._process.on('error', (err) => {
      this._rejectAll(err.message);
    });

    const initResult = await this._request('initialize', {
      protocolVersion: '0.1.0',
      capabilities: {},
      clientInfo: { name: 'xCrab', version: '2.0.0' },
    });

    this._initialized = true;
    return initResult;
  }

  _processLines() {
    const lines = this._buffer.split('\n');
    this._buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id !== undefined && this._pending.has(msg.id)) {
          const { resolve, reject, timer } = this._pending.get(msg.id);
          clearTimeout(timer);
          this._pending.delete(msg.id);
          if (msg.error) {
            reject(new Error(msg.error.message || 'JSON-RPC error'));
          } else {
            resolve(msg.result);
          }
        }
      } catch {
        // 忽略格式异常的行
      }
    }
  }

  _request(method, params, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const id = ++this._requestId;
      const request = JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params: params || {},
      }) + '\n';

      const timer = setTimeout(() => {
        this._pending.delete(id);
        reject(new Error(`MCP 请求 "${method}" 超时 (${timeout}ms)`));
      }, timeout);

      this._pending.set(id, { resolve, reject, timer });
      this._process.stdin.write(request);
    });
  }

  async listTools() {
    if (!this._initialized) throw new Error('MCP 客户端未初始化');
    const result = await this._request('tools/list');
    return result.tools || [];
  }

  async callTool(name, args) {
    if (!this._initialized) throw new Error('MCP 客户端未初始化');
    const result = await this._request('tools/call', { name, arguments: args });
    if (result.content && Array.isArray(result.content)) {
      return result.content.map(c => c.text || JSON.stringify(c)).join('\n');
    }
    return String(result);
  }

  disconnect() {
    this._initialized = false;
    this._rejectAll('客户端已断开');
    if (this._process) {
      this._process.kill();
      this._process = null;
    }
  }

  _rejectAll(message) {
    for (const [, { reject }] of this._pending) {
      reject(new Error(message));
    }
    this._pending.clear();
  }
}

export class MCPManager {
  constructor() {
    this._clients = new Map();
  }

  async loadServers(serverConfigs) {
    const results = [];
    for (const cfg of serverConfigs) {
      try {
        const client = new MCPClient(cfg.id);
        await client.connect(cfg);
        this._clients.set(cfg.id, client);
        results.push({ id: cfg.id, success: true });
      } catch (err) {
        results.push({ id: cfg.id, success: false, error: err.message });
      }
    }
    return results;
  }

  async getAllTools() {
    const allTools = [];
    for (const [serverId, client] of this._clients) {
      try {
        const tools = await client.listTools();
        for (const tool of tools) {
          allTools.push({
            type: 'function',
            function: {
              name: `mcp__${serverId}__${tool.name}`,
              description: tool.description || `MCP 工具 (${serverId})`,
              parameters: tool.inputSchema || { type: 'object', properties: {} },
            },
            _mcp: { serverId, toolName: tool.name },
          });
        }
      } catch (err) {
        console.error(`  ⚠️ 无法获取 MCP 服务器 "${serverId}" 的工具列表: ${err.message}`);
      }
    }
    return allTools;
  }

  async executeTool(serverId, toolName, args) {
    const client = this._clients.get(serverId);
    if (!client) throw new Error(`MCP 服务器 "${serverId}" 未连接`);
    return client.callTool(toolName, args);
  }

  /** 解析完整工具名，返回 { serverId, toolName } 或 null */
  static parseToolName(fullName) {
    const parts = fullName.split('__');
    if (parts.length >= 3 && parts[0] === 'mcp') {
      return { serverId: parts[1], toolName: parts.slice(2).join('__') };
    }
    return null;
  }

  getServerIds() {
    return [...this._clients.keys()];
  }

  get count() {
    return this._clients.size;
  }

  disconnectAll() {
    for (const [, client] of this._clients) {
      client.disconnect();
    }
    this._clients.clear();
  }
}
