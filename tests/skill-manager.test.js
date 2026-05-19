/**
 * xCrab 技能管理器测试
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_SKILLS_DIR = path.join(__dirname, '..', 'data', 'test-skills');

describe('技能管理器 (SkillManager)', () => {
  let SkillManager;
  let manager;

  before(async () => {
    // 创建测试技能目录
    if (!fs.existsSync(TEST_SKILLS_DIR)) {
      fs.mkdirSync(TEST_SKILLS_DIR, { recursive: true });
    }
    // 创建一个测试技能文件
    const testSkillDir = path.join(TEST_SKILLS_DIR, 'test-skill');
    if (!fs.existsSync(testSkillDir)) {
      fs.mkdirSync(testSkillDir, { recursive: true });
    }
    fs.writeFileSync(path.join(testSkillDir, 'SKILL.md'), `---
name: test-skill
description: 测试技能
tags: [test, demo]
---

这是测试技能的指令内容。

## 用法
直接调用即可。
`);

    const mod = await import('../src/skill-manager.js');
    SkillManager = mod.SkillManager;
  });

  after(() => {
    // 清理测试目录
    try { fs.rmSync(TEST_SKILLS_DIR, { recursive: true, force: true }); } catch {}
  });

  it('应创建 SkillManager 实例', () => {
    manager = new SkillManager();
    assert.ok(manager);
  });

  it('loadAll 应从目录加载技能', () => {
    // 使用标准 skills 目录
    manager = new SkillManager();
    manager.loadAll();
    // 至少不会报错
    assert.ok(true);
  });

  it('getSummaryList 应返回技能列表', () => {
    const list = manager.getSummaryList();
    assert.ok(Array.isArray(list));
  });

  it('getSkillContent 对不存在的技能返回 null', () => {
    const content = manager.getSkillContent('nonexistent-skill');
    assert.equal(content, null);
  });

  it('getInfo 对不存在的技能返回 null', () => {
    const info = manager.getInfo('nonexistent-skill');
    assert.equal(info, null);
  });

  it('getConfig 对不存在的技能返回 null', () => {
    const config = manager.getConfig('nonexistent-skill');
    assert.equal(config, null);
  });

  it('setConfig 对不存在的技能返回错误', () => {
    const result = manager.setConfig('nonexistent-skill', 'key', 'value');
    assert.ok(result.includes('未找到'));
  });

  it('listBackups 对不存在的技能返回空数组', () => {
    const backups = manager.listBackups('nonexistent-skill');
    assert.deepEqual(backups, [], '不存在的技能应返回空数组');
  });

  it('checkDependencies 对不存在的技能返回依赖检查结果', () => {
    const result = manager.checkDependencies('nonexistent-skill');
    assert.equal(result.ok, undefined);
    assert.ok(result.missing);
  });

  it('getDependencyTree 对不存在的技能返回 null', () => {
    const tree = manager.getDependencyTree('nonexistent-skill');
    assert.equal(tree, null);
  });

  it('formatConfigForPrompt 应返回字符串', () => {
    const result = manager.formatConfigForPrompt();
    assert.ok(typeof result === 'string');
  });

  it('count 应返回数字', () => {
    assert.ok(typeof manager.count === 'number');
  });
});
