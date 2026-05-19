/**
 * Agent 子任务规划器
 * 自动将复杂任务拆解为子任务并按序执行
 */

const PLAN_SYSTEM_PROMPT = `你是一个任务规划专家。将用户的任务拆解为一系列可执行的子任务。

你只能使用以下工具来执行子任务。每个子任务必须指定 tool 和 args。

以 JSON 数组格式返回子任务列表，每个子任务包含：
- id: 序号 (1, 2, 3...)
- description: 子任务描述
- tool: 要使用的工具名称
- args: 传给工具的参数对象
- dependsOn: 依赖的子任务 id 数组（可选，为空则表示无依赖）

示例：
[
  { "id": 1, "description": "查询北京的天气", "tool": "weather", "args": { "city": "北京" } },
  { "id": 2, "description": "计算 1+1", "tool": "calculate", "args": { "expression": "1+1" }, "dependsOn": [] }
]

只输出 JSON 数组，不要包含其他内容。`;

export class Planner {
  constructor(callLLM) {
    this._callLLM = callLLM;
    this._subtasks = [];
    this._results = [];
  }

  /**
   * 分解任务为子任务列表
   * @param {string} task - 用户任务描述
   * @param {string[]} toolNames - 可用工具名称列表
   * @returns {Promise<Array<{id: number, description: string, tool: string, args: object, dependsOn?: number[]}>>}
   */
  async plan(task, toolNames) {
    const messages = [
      { role: 'system', content: PLAN_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `任务：${task}\n\n可用工具：${toolNames.join(', ')}\n\n请将任务拆解为子任务。`,
      },
    ];

    const data = await this._callLLM(messages, []);
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('规划失败：LLM 未返回有效内容');

    // 提取 JSON 数组
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error(`规划失败：无法解析子任务列表\n${content}`);

    const subtasks = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(subtasks) || subtasks.length === 0) {
      throw new Error('规划失败：子任务列表为空');
    }

    this._subtasks = subtasks;
    return subtasks;
  }

  /**
   * 按依赖顺序执行所有子任务
   * @param {Function} executeTool - 工具执行函数
   * @returns {Promise<Array<{id: number, description: string, result: string}>>}
   */
  async executePlan(executeTool) {
    this._results = [];
    const completed = new Set();

    // 按依赖顺序重复遍历，直到所有任务完成
    while (this._results.length < this._subtasks.length) {
      let progressed = false;

      for (const st of this._subtasks) {
        if (completed.has(st.id)) continue;

        // 检查依赖是否全部完成
        const deps = st.dependsOn || [];
        const depsMet = deps.every(d => completed.has(d));

        if (!depsMet) continue;

        // 执行子任务
        try {
          const result = await executeTool(st.tool, st.args);
          this._results.push({ id: st.id, description: st.description, result, success: true });
        } catch (err) {
          this._results.push({ id: st.id, description: st.description, result: err.message, success: false });
        }

        completed.add(st.id);
        progressed = true;
      }

      if (!progressed) {
        // 死锁检测
        const pending = this._subtasks.filter(st => !completed.has(st.id));
        throw new Error(`规划执行死锁：以下子任务依赖无法满足: ${pending.map(p => `#${p.id} ${p.description}`).join(', ')}`);
      }
    }

    return this._results;
  }

  /**
   * 汇总所有子任务结果
   * @param {Array} results - 执行结果
   * @returns {string}
   */
  summarizeResults(results) {
    const parts = results.map(r =>
      `  ${r.success ? '✅' : '❌'} [#${r.id}] ${r.description}\n    结果: ${r.result}`
    );
    return `子任务执行结果:\n${parts.join('\n')}`;
  }

  /** 执行一次完整的规划-执行-汇总流程 */
  async run(task, toolNames, executeTool) {
    console.log(`  📋 正在规划任务: "${task}"`);
    const subtasks = await this.plan(task, toolNames);
    console.log(`  📋 计划拆分为 ${subtasks.length} 个子任务`);

    const results = await this.executePlan(executeTool);
    return this.summarizeResults(results);
  }
}
