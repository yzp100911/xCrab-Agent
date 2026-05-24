const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../.data/memory');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

class MemoryStore {
  constructor() {
    this.data = { sessions: {}, memories: [] };
  }

  async initialize() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        const content = await fs.readFile(STORE_FILE, 'utf-8');
        this.data = JSON.parse(content);
      } catch {
        await this.save();
      }
    } catch (error) {
      console.error('Memory store initialization failed:', error);
    }
  }

  async save() {
    await fs.writeFile(STORE_FILE, JSON.stringify(this.data, null, 2));
  }

  async add(sessionId, role, content) {
    if (!this.data.sessions[sessionId]) {
      this.data.sessions[sessionId] = [];
    }
    this.data.sessions[sessionId].push({ role, content, timestamp: Date.now() });
    await this.save();
  }

  async search(query, sessionId = null, limit = 10) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    if (sessionId && this.data.sessions[sessionId]) {
      for (const msg of this.data.sessions[sessionId]) {
        if (msg.content.toLowerCase().includes(queryLower)) {
          results.push(msg);
        }
      }
    }
    
    return results.slice(0, limit);
  }

  async get(sessionId, limit = 50) {
    if (!this.data.sessions[sessionId]) return [];
    return this.data.sessions[sessionId].slice(-limit);
  }

  async getAll(sessionId = null) {
    if (sessionId) {
      return this.data.sessions[sessionId] || [];
    }
    return Object.entries(this.data.sessions).flatMap(([sid, msgs]) =>
      msgs.map(m => ({ ...m, sessionId: sid }))
    );
  }

  async formatForPrompt(sessionId = null, limit = 20) {
    const memories = sessionId 
      ? await this.get(sessionId, limit) 
      : (await this.getAll()).slice(-limit);
    
    if (memories.length === 0) return '';
    
    return '\\n\\n--- 最近对话记录 ---\\  +
      memories.map(m => m.role + ': ' + m.content).join('\\n') +
      '\\n--- 记录结束 ---\\n';
  }

  async clear(sessionId = null) {
    if (sessionId) {
      delete this.data.sessions[sessionId];
    } else {
      this.data.sessions = {};
    }
    await this.save();
  }
}

module.exports = { MemoryStore };
