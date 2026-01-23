import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/data/db.js', () => {
  const store = [];
  return {
    getTrends: vi.fn().mockImplementation(async () => store.slice()),
    saveTrends: vi.fn().mockImplementation(async (data) => {
      for (const d of data) store.push(d);
      return true;
    }),
  };
});

vi.mock('../../src/llm/index.js', () => ({
  runPrompt: vi.fn().mockResolvedValue(
    JSON.stringify([
      { topic: 'AI Music Tools', score: 0.92 },
      { topic: 'Climate Protests', score: 0.85 },
      { topic: 'Electric Cars', score: 0.81 },
    ]),
  ),
}));

import { runTrendAgent } from '../../src/agents/trendAgent.ts';
import { getTrends, saveTrends } from '../../src/data/db.js';

describe('trendAgent', () => {
  it('seeds trends when DB empty', async () => {
    const trends = await runTrendAgent();
    expect(getTrends).toHaveBeenCalled();
    expect(saveTrends).toHaveBeenCalled();
    expect(Array.isArray(trends)).toBe(true);
  });
});
