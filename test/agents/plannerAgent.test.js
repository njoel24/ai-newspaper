import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/data/db.js', () => ({
  getTrends: vi.fn().mockResolvedValue([
    { topic: 'AI Music', score: 0.9 },
    { topic: 'Cars', score: 0.8 },
  ]),
  savePlan: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../src/llm/index.js', () => ({
  runPrompt: vi.fn().mockResolvedValue(JSON.stringify([{ title: 'T', summary: 'S', topic: 'AI' }])),
}));

import { runPlannerAgent } from '../../src/agents/plannerAgent.ts';
import { getTrends, savePlan } from '../../src/data/db.js';
import { runPrompt } from '../../src/llm/index.js';

describe('plannerAgent', () => {
  it('calls LLM and saves plan', async () => {
    await runPlannerAgent();
    expect(getTrends).toHaveBeenCalled();
    expect(runPrompt).toHaveBeenCalled();
    expect(savePlan).toHaveBeenCalled();
  });
});
