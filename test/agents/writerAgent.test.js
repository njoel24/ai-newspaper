import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/data/db.js', () => ({
  getLatestPlan: vi.fn().mockResolvedValue({ id: 'p1', topics: { trends: [{ topic: 'AI', angle: 'cool' }] } }),
  saveArticle: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../src/llm/index.js', () => ({
  runPrompt: vi.fn().mockResolvedValue(JSON.stringify({ title: 'Title', summary: 'Sum', body: 'Body' })),
}));

import { runWriterAgent } from '../../src/agents/writerAgent.ts';
import { getLatestPlan, saveArticle } from '../../src/data/db.js';
import { runPrompt } from '../../src/llm/index.js';

describe('writerAgent', () => {
  it('generates and saves articles for plan topics', async () => {
    const res = await runWriterAgent();
    expect(getLatestPlan).toHaveBeenCalled();
    expect(runPrompt).toHaveBeenCalled();
    expect(saveArticle).toHaveBeenCalled();
    expect(Array.isArray(res)).toBe(true);
  });
});
