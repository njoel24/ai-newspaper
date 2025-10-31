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

import { runTrendAgent } from '../../src/agents/trendAgent.js';
import { getTrends, saveTrends } from '../../src/data/db.js';

describe('trendAgent', () => {
  it('seeds trends when DB empty', async () => {
    const trends = await runTrendAgent();
    expect(getTrends).toHaveBeenCalled();
    expect(saveTrends).toHaveBeenCalled();
    expect(Array.isArray(trends)).toBe(true);
  });
});
