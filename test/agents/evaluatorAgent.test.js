import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/data/db.js', () => ({
  getArticles: vi.fn().mockResolvedValue([{ id: 'a1', title: 'T1' }]),
  saveAnalytics: vi.fn().mockResolvedValue(true),
}));

import { runEvaluatorAgent } from '../../src/agents/evaluatorAgent.js';
import { getArticles, saveAnalytics } from '../../src/data/db.js';

describe('evaluatorAgent', () => {
  it('saves analytics for articles', async () => {
    const res = await runEvaluatorAgent();
    expect(getArticles).toHaveBeenCalled();
    expect(saveAnalytics).toHaveBeenCalled();
    expect(Array.isArray(res)).toBe(true);
  });
});
