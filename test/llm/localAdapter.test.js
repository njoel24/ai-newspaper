import { describe, it, expect } from 'vitest';
import path from 'path';
import { runPrompt } from '../../src/llm/localAdapter.js';

describe('localAdapter', () => {
  it('returns 3 planner suggestions as JSON array', async () => {
    const promptFile = path.join(process.cwd(), 'llm', 'planner-prompt.md');
    const trendsText = '- AI Music Tools (0.92)\n- Climate Protests (0.85)\n- Electric Cars (0.81)';
    const res = await runPrompt(promptFile, { trends: trendsText });
    const parsed = JSON.parse(res);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(3);
    expect(parsed[0]).toHaveProperty('title');
  });

  it('returns writer JSON with title, summary, body', async () => {
    const promptFile = path.join(process.cwd(), 'llm', 'writer-prompt.md');
    const res = await runPrompt(promptFile, { topic: 'Test Topic', angle: 'A cool angle' });
    const parsed = JSON.parse(res);
    expect(parsed).toHaveProperty('title');
    expect(parsed).toHaveProperty('summary');
    expect(parsed).toHaveProperty('body');
  });
});
