/**
 * xCrab 持久化记忆系统
 * 基于 SQLite 的三层记忆存储
 * - short: 短期记忆，仅当前对话有效
 * - mid: 中期记忆，跨会话持久化，自动摘要压缩
 * - long: 长期记忆，重要事实，不会自动清理
 */

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SQLiteStore } from './sqlite-store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class MemoryStore {
  /**
   * @param {object} [options]
   * @param {string} [options.dbPath] - SQLite 文件路径
   * @param {number} [options.maxMidMemories] - 中期记忆上限，超过后触发衰减
   */
  constructor(options = {}) {
    this.dbPath = options.dbPath || path.resolve(__dirname, '..', '..', 'memory', 'memories.db');
    this.maxMidMemories = options.maxMidMemories || 100;
    this._changeCount = 0;
    this._db = new SQLiteStore(this.dbPath);
    this._migrateFromJson();
  }

  /**
   * 从旧版 JSON 文件迁移数据
   */
  _migrateFromJson() {
    const oldFile = path.resolve(__dirname, '..', '..', 'memory', 'memories.json');
    if (!fs.existsSync(oldFile)) return;

    try {
      const raw = fs.readFileSync(oldFile, 'utf-8');
      const data = JSON.parse(raw);

      if (data.memories && Array.isArray(data.memories)) {
        for (const m of data.memories) {
          this._db.upsert(m.key, m.value, {
            category: m.category || 'general',
            level: 'mid',
          });
        }
        console.log(`  📦 已从 memories.json 迁移 ${data.memories.length} 条记忆`);
      }

      if (data.conversations && Array.isArray(data.conversations)) {
        for (const c of data.conversations) {
          this._db.saveConversationSummary(c.summary || '(迁移摘要)');
        }
      }

      // 重命名旧文件，避免重复迁移
      fs.renameSync(oldFile, oldFile + '.bak');
      console.log('  📦 旧版 memories.json 已备份为 memories.json.bak');
    } catch (err) {
      console.error(`  ⚠️ 记忆迁移失败: ${err.message}`);
    }
  }

  /**
   * 存储一条记忆
   * @param {string} key - 键名
   * @param {string} value - 内容
   * @param {string} [category] - 分类
   * @param {string} [level] - 层级: short|mid|long
   */
  save(key, value, category = 'general', level = 'mid') {
    this._db.upsert(key, value, { category, level });
    this._changeCount++;
    if (this._changeCount % 10 === 0) {
      this._autoDecay();
    }
  }

  /**
   * 读取一条记忆
   * @param {string} key
   * @returns {string|null}
   */
  load(key) {
    return this._db.load(key);
  }

  /**
   * 删除一条记忆
   */
  remove(key) {
    this._db.remove(key);
  }

  /**
   * 获取所有记忆
   * @returns {Array}
   */
  getAll() {
    return this._db.getAll();
  }

  /**
   * 搜索相关记忆
   * @param {string} query
   * @returns {Array}
   */
  search(query) {
    return this._db.search(query);
  }

  /**
   * 按层级获取记忆
   * @param {string} level
   * @param {number} limit
   * @returns {Array}
   */
  getByLevel(level, limit = 100) {
    return this._db.getByLevel(level, limit);
  }

  /**
   * 保存对话摘要
   * @param {string} summary
   */
  saveConversationSummary(summary) {
    this._db.saveConversationSummary(summary);
  }

  /**
   * 获取最近的对话摘要
   * @param {number} limit
   * @returns {string[]}
   */
  getRecentSummaries(limit = 5) {
    return this._db.getRecentSummaries(limit);
  }

  /**
   * 自动衰减：当中期记忆超过上限时，将最早的压缩为摘要
   */
  _autoDecay() {
    try {
      const mids = this._db.getByLevel('mid', this.maxMidMemories + 10);
      if (mids.length <= this.maxMidMemories) return;

      // 将最旧的 10 条用一条摘要替代
      const toArchive = mids.slice(-10);
      const keys = toArchive.map(m => m.key);
      const summaryText = keys.join(', ') + ' 等 ' + keys.length + ' 条记忆';

      // 删除这些旧记忆
      for (const m of toArchive) {
        this._db.remove(m.key);
      }

      // 将摘要保存为 long 级记忆
      this._db.upsert(`_archive_${Date.now()}`, `[归档] ${summaryText}`, {
        category: 'archive',
        level: 'long',
      });
    } catch {
      // 衰减失败不阻塞业务
    }
  }

  /**
   * 将记忆格式化为 system prompt 可用的文本
   * @returns {string}
   */
  formatForPrompt() {
    const parts = [];

    const memories = this._db.getAll().filter(m => m.level !== 'short');
    if (memories.length > 0) {
      parts.push('## 关于用户的记忆');
      for (const m of memories.slice(0, 30)) {
        parts.push(`  ${m.key}: ${m.value}`);
      }
    }

    const summaries = this.getRecentSummaries();
    if (summaries.length > 0) {
      parts.push('\n## 历史对话摘要');
      for (const s of summaries) {
        parts.push(`  - ${s}`);
      }
    }

    return parts.length > 0 ? parts.join('\n') : '';
  }
}
