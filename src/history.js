import { getModel } from './config.js';

function getBasePrompt() {
  const modelName = getModel();
  return `你是一个名为 xCrab 的智能助手，由 ${modelName} 模型驱动。
你擅长通过工具调用帮助用户解决问题。回答简洁、准确、友好。
重要规则：当你通过工具获取到足够信息后，应立即总结并回答用户，不要反复获取更多数据。`;
}

export class History {
  constructor(skillManager = null, memoryStore = null, maxTokens = 1000000, workspaceManager = null) {
    this.maxTokens = maxTokens;
    this.skillManager = skillManager;
    this.memoryStore = memoryStore;
    this.workspaceManager = workspaceManager;
    this.messages = [{ role: 'system', content: this._buildSystemPrompt() }];
  }

  setWorkspaceManager(wm) {
    this.workspaceManager = wm;
    this.refreshSystemPrompt();
  }

  /** 构建 system prompt（含工作区 + 技能列表 + 记忆） */
  _buildSystemPrompt() {
    let prompt = getBasePrompt();

    // 1. 注入工作区上下文
    if (this.workspaceManager) {
      const wsText = this.workspaceManager.formatForPrompt();
      if (wsText) {
        prompt += wsText;
      }
    }

    // 2. 注入技能列表
    if (this.skillManager && this.skillManager.count > 0) {
      prompt += this.skillManager.formatSkillsPrompt();
    }

    // 3. 注入记忆
    if (this.memoryStore) {
      const memoryText = this.memoryStore.formatForPrompt();
      if (memoryText) {
        prompt += `\n\n${memoryText}`;
      }
    }

    return prompt;
  }

  /** 刷新 system prompt（技能列表变化后调用） */
  refreshSystemPrompt() {
    if (this.messages.length > 0 && this.messages[0].role === 'system') {
      this.messages[0].content = this._buildSystemPrompt();
    }
  }

  add(role, content) {
    this.messages.push({ role, content });
    this._trim();
  }

  addToolResult(toolCallId, content) {
    this.messages.push({
      role: 'tool',
      tool_call_id: toolCallId,
      content: String(content),
    });
    this._trim();
  }

  addAssistantMessage(message) {
    this.messages.push(message);
    this._trim();
  }

  getMessages() {
    return this.messages;
  }

  _trim() {
    let total = 0;
    const recent = [];

    for (let i = this.messages.length - 1; i >= 0; i--) {
      const msg = this.messages[i];
      if (msg.role === 'system') continue;
      const len = msg.content ? msg.content.length : 0;
      if (total + len > this.maxTokens * 2) break;
      total += len;
      recent.push(msg);
    }

    recent.reverse();
    this.messages = [{ role: 'system', content: this._buildSystemPrompt() }, ...recent];
  }

  clear() {
    this.messages = [{ role: 'system', content: this._buildSystemPrompt() }];
  }

  printStats() {
    const totalChars = this.messages.reduce((s, m) => s + (m.content?.length || 0), 0);
    console.log(`  [历史: ${this.messages.length} 条消息, ~${Math.ceil(totalChars / 2)} tokens]`);

    // 如果启用了记忆，显示记忆统计
    if (this.memoryStore) {
      const memories = this.memoryStore.getAll();
      const summaries = this.memoryStore.getRecentSummaries();
      console.log(`  [记忆: ${memories.length} 条, 对话摘要: ${summaries.length} 条]`);
    }
  }

  /**
   * 获取当前对话的最后一条用户消息
   * 用于 LLM 调用后自动生成对话摘要
   */
  getLastUserMessage() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].role === 'user') {
        return this.messages[i].content;
      }
    }
    return null;
  }

  /**
   * 获取当前对话的最后一条助手回复
   */
  getLastAssistantMessage() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const m = this.messages[i];
      if (m.role === 'assistant' && m.content && !m.tool_calls) {
        return m.content;
      }
    }
    return null;
  }
}
