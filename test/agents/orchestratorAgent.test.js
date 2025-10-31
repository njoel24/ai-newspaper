import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/agents/plannerAgent.ts', () => ({ runPlannerAgent: vi.fn().mockResolvedValue([{topic:'a'}]) }));
vi.mock('../../src/agents/writerAgent.ts', () => ({ runWriterAgent: vi.fn().mockResolvedValue([{ success: true }]) }));
vi.mock('../../src/agents/evaluatorAgent.ts', () => ({ runEvaluatorAgent: vi.fn().mockResolvedValue([{articleId:'1'}]) }));
vi.mock('../../src/agents/trendAgent.ts', () => ({ runTrendAgent: vi.fn().mockResolvedValue([{topic:'a'}]) }));

import { runOrchestratorAgent } from '../../src/agents/orchestratorAgent.ts';

describe('orchestratorAgent', () => {
  it('runs planner, writer, evaluator and returns summary', async () => {
    const summary = await runOrchestratorAgent();
    expect(summary).toHaveProperty('planner');
    expect(summary.planner.success).toBe(true);
    expect(summary.writer.success).toBe(true);
    expect(summary.evaluator.success).toBe(true);
  });
});
