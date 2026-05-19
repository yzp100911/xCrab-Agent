/**
 * Mock LLM 调用辅助模块
 * 提供模拟的 callLLM 和 executeTool 供测试使用
 */

/**
 * 创建一个模拟的 callLLM 函数
 * @param {object} [options]
 * @param {string} [options.content] - 模拟回复内容
 * @param {Array} [options.toolCalls] - 模拟工具调用
 * @returns {Function} mockCallLLM
 */
export function createMockLLM(options = {}) {
  const { content = '这是模拟回复', toolCalls } = options;

  return async function mockCallLLM(messages, tools) {
    const choice = {
      index: 0,
      message: { role: 'assistant' },
      finish_reason: 'stop',
    };

    if (toolCalls && toolCalls.length > 0) {
      choice.message.tool_calls = toolCalls;
      choice.finish_reason = 'tool_calls';
    } else {
      choice.message.content = content;
    }

    return {
      id: 'mock-cmpl-' + Date.now(),
      model: 'mock-model',
      choices: [choice],
      usage: {
        prompt_tokens: 50,
        completion_tokens: 30,
        total_tokens: 80,
      },
    };
  };
}

/**
 * 创建一个模拟的 executeTool 函数
 * @returns {Function} mockExecuteTool
 */
export function createMockExecuteTool() {
  return async function mockExecuteTool(toolName, args) {
    return `模拟执行 ${toolName}: ${JSON.stringify(args)}`;
  };
}
