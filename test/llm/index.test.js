import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';

// Ensure local adapter is used
process.env.USE_LOCAL_LLM = 'true';

import { runPrompt } from '../../src/llm/index.ts';

describe('llm/index runPrompt (local)', () => {
  it('invokes local adapter for planner prompt', async () => {
    const promptFile = path.join(process.cwd(), 'prompts', 'planner-prompt.md');
    const trendsText = '- Topic A (0.9)\n- Topic B (0.8)';
    const res = await runPrompt(promptFile, { trends: trendsText });
    const parsed = JSON.parse(res);
    expect(Array.isArray(parsed)).toBe(true);
  });
});
