/**
 * xCrab 工具系统测试
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

// 保存原始模块引用
let toolDefinitions, executeTool, setMemoryStore, setSkillManager;

describe('工具系统', () => {
  before(async () => {
    const mod = await import('../src/tools.js');
    toolDefinitions = mod.toolDefinitions;
    executeTool = mod.executeTool;
    setMemoryStore = mod.setMemoryStore;
    setSkillManager = mod.setSkillManager;

    // Mock SkillManager
    setSkillManager({
      getSkillContent: () => null,
      getSummaryList: () => [],
      getConfig: () => ({}),
      setConfig: () => 'ok',
    });
  });

  it('应包含所有必需的工具定义', () => {
    const requiredTools = [
      'get_time', 'calculate', 'weather', 'web_search',
      'read_skill', 'search_skills', 'install_skill',
      'run_command', 'remember', 'recall', 'create_plan',
      'configure_skill', 'render_canvas',
    ];

    const names = toolDefinitions.map(t => t.function.name);
    for (const name of requiredTools) {
      assert.ok(names.includes(name), `缺少工具定义: ${name}`);
    }
  });

  it('get_time 应返回时间字符串', async () => {
    const result = await executeTool('get_time', { timezone: 'Asia/Shanghai' });
    assert.ok(result.includes('Asia/Shanghai'));
    assert.ok(result.includes(':'));
  });

  it('calculate 应正确计算数学表达式', async () => {
    const result = await executeTool('calculate', { expression: '1 + 2 * 3' });
    assert.ok(result.includes('7'));
  });

  it('calculate 应安全处理表达式', async () => {
    const result = await executeTool('calculate', { expression: '1 + 2' });
    assert.ok(result.includes('3'));
  });

  it('weather 应返回天气信息', async () => {
    const result = await executeTool('weather', { city: '北京' });
    assert.ok(result.includes('北京'));
  });

  it('未知工具应返回错误信息', async () => {
    const result = await executeTool('nonexistent_tool', {});
    assert.ok(result.includes('未知工具'));
  });

  it('render_canvas 应创建有效图表（bar 类型）', async () => {
    const result = await executeTool('render_canvas', {
      type: 'bar',
      title: '测试柱状图',
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [{ label: '系列1', values: [10, 20, 15] }],
      },
    });
    assert.ok(result.includes('图表已创建'));
    assert.ok(result.includes('[canvas:'));
  });

  it('render_canvas 应拒绝无效数据', async () => {
    const result = await executeTool('render_canvas', {
      type: 'bar',
      data: { labels: ['A'], datasets: [] },
    });
    assert.ok(result.includes('失败'));
  });

  it('remember 应返回记忆系统未启用的提示', async () => {
    // memoryStore 未设置
    const result = await executeTool('remember', { key: 'test', value: 'test' });
    assert.ok(result.includes('记忆系统未启用'));
  });
});

describe('工具定义格式', () => {
  it('所有工具定义应包含 name 和 description', () => {
    for (const t of toolDefinitions) {
      assert.ok(t.function.name, `工具缺少 name: ${JSON.stringify(t)}`);
      assert.ok(t.function.description, `工具 ${t.function.name} 缺少 description`);
    }
  });

  it('所有工具定义应包含 parameters', () => {
    for (const t of toolDefinitions) {
      assert.ok(t.function.parameters, `工具 ${t.function.name} 缺少 parameters`);
    }
  });
});
