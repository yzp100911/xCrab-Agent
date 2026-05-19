/**
 * WorkspaceManager — 轻量级工作区/角色系统
 *
 * 每个 workspace 是一个目录，包含 .md 文件来定义 AI 的人格和上下文：
 *   IDENTITY.md — AI 身份（名字、性格）
 *   SOUL.md     — 核心行为准则
 *   USER.md     — 用户信息
 *   HEARTBEAT.md— 状态跟踪（可选）
 *
 * 目录结构：
 *   <baseDir>/workspace-main/    — 默认工作区
 *   <baseDir>/workspaces/<name>/ — 其他工作区
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_BASE = path.resolve(__dirname, '..', '..', 'data');

const WORKSPACE_FILES = ['IDENTITY.md', 'SOUL.md', 'USER.md', 'HEARTBEAT.md'];

const DEFAULT_CONTENT = {
  'IDENTITY.md': `# IDENTITY.md — 我是谁

- **名称:** xCrab
- **类型:** AI 智能助手
- **Emoji:** 🦞
- **性格:** 简洁、准确、友好
`,
  'SOUL.md': `# SOUL.md — 核心准则

- 回答要简洁直接，避免冗长
- 不确定时坦承不确定
- 优先使用工具来提供准确信息
- 尊重用户隐私和选择
`,
  'USER.md': `# USER.md — 关于用户

- **名称:** 用户
- **时区:** Asia/Shanghai
- **语言:** 简体中文
`,
  'HEARTBEAT.md': `# HEARTBEAT.md — 定期任务

（可选 — 取消注释以下行来启用定期任务）
# - 每 30 分钟自动总结当前工作状态
`,
};

export class WorkspaceManager {
  /**
   * @param {string} [baseDir] - 工作区根目录，默认 data/
   */
  constructor(baseDir) {
    this.baseDir = baseDir || DEFAULT_BASE;
    /** @type {string} 当前激活的工作区名称 */
    this.activeName = 'main';
    /** @type {object|null} 当前工作区的文件内容 */
    this.currentFiles = null;
  }

  /** 初始化：确保默认工作区存在，加载当前工作区 */
  async init(activeName) {
    if (activeName) this.activeName = activeName;
    this._ensureDir(this.baseDir);
    this._ensureDefaultWorkspace();
    this.currentFiles = this._loadWorkspace(this.activeName);
  }

  /**
   * 加载指定工作区的全部 .md 文件
   * @param {string} name - 工作区名称
   * @returns {object} { identity, soul, user, heartbeat, raw }
   */
  _loadWorkspace(name) {
    const dir = this._resolveDir(name);
    const result = { identity: '', soul: '', user: '', heartbeat: '' };

    if (!fs.existsSync(dir)) return result;

    for (const file of WORKSPACE_FILES) {
      const fp = path.join(dir, file);
      try {
        const content = fs.readFileSync(fp, 'utf-8').trim();
        const key = file.replace('.md', '').toLowerCase();
        result[key] = content;
      } catch {
        // 文件不存在或读取失败
      }
    }

    return result;
  }

  /**
   * 切换到指定工作区
   * @param {string} name
   * @returns {{ success: boolean, error?: string }}
   */
  switchWorkspace(name) {
    const dir = this._resolveDir(name);
    if (!fs.existsSync(dir)) {
      return { success: false, error: `工作区 "${name}" 不存在` };
    }

    this.activeName = name;
    this.currentFiles = this._loadWorkspace(name);
    return { success: true };
  }

  /**
   * 列出所有可用工作区
   * @returns {Array<{ name: string, desc: string, fileCount: number }>}
   */
  listWorkspaces() {
    const list = [];

    // workspace-main 始终存在
    const mainDir = this._resolveDir('main');
    if (fs.existsSync(mainDir)) {
      list.push({ name: 'main', desc: '默认工作区', fileCount: this._countFiles(mainDir) });
    }

    // 扫描 workspaces/ 子目录
    const wsDir = path.join(this.baseDir, 'workspaces');
    if (fs.existsSync(wsDir)) {
      try {
        const entries = fs.readdirSync(wsDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const infoPath = path.join(wsDir, entry.name, 'IDENTITY.md');
            let desc = '';
            try {
              const firstLine = fs.readFileSync(infoPath, 'utf-8').split('\n')[0] || '';
              desc = firstLine.replace(/^#\s*/, '').trim();
            } catch {}
            list.push({
              name: entry.name,
              desc: desc || `角色: ${entry.name}`,
              fileCount: this._countFiles(path.join(wsDir, entry.name)),
            });
          }
        }
      } catch {}
    }

    return list;
  }

  /**
   * 创建新的工作区（从默认模板复制）
   * @param {string} name
   * @returns {{ success: boolean, error?: string }}
   */
  initWorkspace(name) {
    if (!name || name === 'main') {
      return { success: false, error: '无效的工作区名称' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return { success: false, error: '名称只能包含字母、数字、下划线和连字符' };
    }

    const dir = path.join(this.baseDir, 'workspaces', name);
    if (fs.existsSync(dir)) {
      return { success: false, error: `工作区 "${name}" 已存在` };
    }

    this._ensureDir(dir);
    for (const file of WORKSPACE_FILES) {
      const fp = path.join(dir, file);
      try {
        fs.writeFileSync(fp, DEFAULT_CONTENT[file], 'utf-8');
      } catch {}
    }

    // 切换到新工作区
    this.activeName = name;
    this.currentFiles = this._loadWorkspace(name);
    return { success: true };
  }

  /** 格式化当前工作区为 system prompt 文本 */
  formatForPrompt() {
    if (!this.currentFiles) return '';

    const parts = [];
    const { identity, soul, user, heartbeat } = this.currentFiles;

    if (identity) {
      parts.push(`### IDENTITY.md\n${identity}`);
    }
    if (soul) {
      parts.push(`### SOUL.md\n${soul}`);
    }
    if (user) {
      parts.push(`### USER.md\n${user}`);
    }
    if (heartbeat) {
      parts.push(`### HEARTBEAT.md\n${heartbeat}`);
    }

    if (parts.length === 0) return '';

    return (
      `\n## 当前工作区 (${this.activeName})\n` +
      `以下工作区文件定义了你的身份和上下文：\n\n` +
      parts.join('\n\n')
    );
  }

  /** 获取简短的当前工作区摘要（用于 CLI 显示） */
  getSummary() {
    if (!this.currentFiles) return '未加载';

    const { identity, soul, user } = this.currentFiles;
    const nameMatch = identity?.match(/\*\*名称[：:]\s*(.+)/);
    const typeMatch = identity?.match(/\*\*类型[：:]\s*(.+)/) || identity?.match(/\*\*Type[：:]\s*(.+)/);
    const userName = user?.match(/\*\*名称[：:]\s*(.+)/);

    const lines = [`工作区: ${this.activeName}`];
    if (nameMatch) lines.push(`  AI: ${nameMatch[1].trim()}`);
    if (typeMatch) lines.push(`  类型: ${typeMatch[1].trim()}`);
    if (userName) lines.push(`  用户: ${userName[1].trim()}`);

    const soulLines = soul ? soul.split('\n').filter(l => l.startsWith('- ')).length : 0;
    if (soulLines > 0) lines.push(`  准则: ${soulLines} 条`);

    return lines.join('\n');
  }

  // ---- 内部辅助 ----

  /** 确保默认工作区文件存在 */
  _ensureDefaultWorkspace() {
    const dir = this._resolveDir('main');
    this._ensureDir(dir);

    for (const file of WORKSPACE_FILES) {
      const fp = path.join(dir, file);
      if (!fs.existsSync(fp)) {
        try {
          fs.writeFileSync(fp, DEFAULT_CONTENT[file], 'utf-8');
        } catch (err) {
          console.error(`  ⚠️ 无法创建 ${file}: ${err.message}`);
        }
      }
    }
  }

  /** 解析工作区目录路径 */
  _resolveDir(name) {
    if (name === 'main') {
      return path.join(this.baseDir, 'workspace-main');
    }
    return path.join(this.baseDir, 'workspaces', name);
  }

  /** 确保目录存在 */
  _ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {}
    }
  }

  /** 统计目录中的 .md 文件数 */
  _countFiles(dir) {
    let count = 0;
    try {
      const entries = fs.readdirSync(dir);
      for (const e of entries) {
        if (e.endsWith('.md')) count++;
      }
    } catch {}
    return count;
  }
}
