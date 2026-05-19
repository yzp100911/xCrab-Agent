/**
 * xCrab SQLite 底层存储封装
 * 提供同步数据库操作接口
 */

import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.resolve(__dirname, '..', '..', 'memory', 'memories.db');

export class SQLiteStore {
  /**
   * @param {string} [dbPath] - SQLite 文件路径
   */
  constructor(dbPath) {
    this.dbPath = dbPath || DEFAULT_DB_PATH;
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this._initTables();
  }

  _initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        level TEXT DEFAULT 'mid' CHECK(level IN ('short','mid','long')),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        access_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        summary TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS embeddings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memory_id INTEGER NOT NULL,
        vector BLOB,
        FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_memories_key ON memories(key);
      CREATE INDEX IF NOT EXISTS idx_memories_level ON memories(level);
      CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);
    `);
  }

  /** 保存/更新一条记忆 */
  upsert(key, value, { category = 'general', level = 'mid' } = {}) {
    const now = Date.now();
    const stmt = this.db.prepare(`
      INSERT INTO memories (key, value, category, level, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        category = excluded.category,
        level = excluded.level,
        updated_at = excluded.updated_at
    `);
    stmt.run(key, value, category, level, now, now);
  }

  /** 按 key 加载一条记忆 */
  load(key) {
    const row = this.db.prepare('SELECT value FROM memories WHERE key = ?').get(key);
    if (row) {
      this.db.prepare('UPDATE memories SET access_count = access_count + 1 WHERE key = ?').run(key);
      return row.value;
    }
    return null;
  }

  /** 删除一条记忆 */
  remove(key) {
    this.db.prepare('DELETE FROM memories WHERE key = ?').run(key);
  }

  /** 获取所有记忆 */
  getAll() {
    return this.db.prepare('SELECT * FROM memories ORDER BY updated_at DESC').all();
  }

  /** 关键词搜索 */
  search(query) {
    const q = `%${query}%`;
    return this.db.prepare(
      'SELECT * FROM memories WHERE key LIKE ? OR value LIKE ? ORDER BY updated_at DESC'
    ).all(q, q);
  }

  /** 按层级获取记忆 */
  getByLevel(level, limit = 100) {
    return this.db.prepare(
      'SELECT * FROM memories WHERE level = ? ORDER BY updated_at DESC LIMIT ?'
    ).all(level, limit);
  }

  /** 获取记忆总数 */
  getCount() {
    const row = this.db.prepare('SELECT COUNT(*) as cnt FROM memories').get();
    return row.cnt;
  }

  /** 保存对话摘要 */
  saveConversationSummary(summary) {
    this.db.prepare('INSERT INTO conversations (summary, created_at) VALUES (?, ?)').run(summary, Date.now());
    // 最多保留 100 条
    this.db.exec('DELETE FROM conversations WHERE id NOT IN (SELECT id FROM conversations ORDER BY id DESC LIMIT 100)');
  }

  /** 获取最近对话摘要 */
  getRecentSummaries(limit = 5) {
    return this.db.prepare(
      'SELECT summary FROM conversations ORDER BY id DESC LIMIT ?'
    ).all(limit).map(r => r.summary);
  }

  /** 关闭数据库连接 */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
