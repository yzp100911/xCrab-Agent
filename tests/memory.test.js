/**
 * xCrab 记忆系统测试
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DB = path.join(__dirname, '..', 'data', 'test-memory.db');

describe('记忆系统 (MemoryStore)', () => {
  let MemoryStore;

  before(async () => {
    // 清理旧的测试数据库
    try { fs.unlinkSync(TEST_DB); } catch {}
    const mod = await import('../src/memory/store.js');
    MemoryStore = mod.MemoryStore;
  });

  after(() => {
    try { fs.unlinkSync(TEST_DB); } catch {}
  });

  it('应创建并初始化 SQLite 数据库', () => {
    const store = new MemoryStore({ dbPath: TEST_DB });
    assert.ok(store);
    store.close();
  });

  it('应保存并读取记忆', () => {
    const store = new MemoryStore({ dbPath: TEST_DB });
    store.save('test_key', 'test_value', 'general', 'mid');
    const result = store.load('test_key');
    assert.equal(result?.value, 'test_value');
    assert.equal(result?.level, 'mid');
    store.close();
  });

  it('应覆盖已存在的 key', () => {
    const store = new MemoryStore({ dbPath: TEST_DB });
    store.save('test_key', 'new_value', 'user_info', 'long');
    const result = store.load('test_key');
    assert.equal(result?.value, 'new_value');
    assert.equal(result?.level, 'long');
    store.close();
  });

  it('应搜索关键词', () => {
    const store = new MemoryStore({ dbPath: TEST_DB });
    store.save('user_name', '张三', 'user_info', 'mid');
    const results = store.search('张三');
    assert.ok(results.length > 0);
    assert.ok(results.some(r => r.key === 'user_name'));
    store.close();
  });

  it('应获取所有记忆', () => {
    const store = new MemoryStore({ dbPath: TEST_DB });
    const all = store.getAll();
    assert.ok(all.length > 0);
    store.close();
  });

  it('应按层级过滤', () => {
    const store = new MemoryStore({ dbPath: TEST_DB });
    store.save('long_test', 'long_value', 'fact', 'long');
    const longItems = store.getByLevel('long');
    assert.ok(longItems.some(r => r.key === 'long_test'));
    store.close();
  });

  it('应删除记忆', () => {
    const store = new MemoryStore({ dbPath: TEST_DB });
    store.save('temp_key', 'temp_value');
    store.remove('temp_key');
    const result = store.load('temp_key');
    assert.equal(result, null);
    store.close();
  });

  it('formatForPrompt 应返回格式化字符串', () => {
    const store = new MemoryStore({ dbPath: TEST_DB });
    save_history_only(store, 'format_test', 'format_value');
    const formatted = store.formatForPrompt();
    assert.ok(typeof formatted === 'string');
    store.close();
  });
});

/** 辅助：保存历史（绕过层级过滤）*/
function save_history_only(store, key, value) {
  store.save(key, value, 'general', 'mid');
}
