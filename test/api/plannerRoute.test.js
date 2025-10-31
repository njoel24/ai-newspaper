import { describe, it, expect } from 'vitest';
import plannerRoute from '../../src/api/agents/planner.ts';

describe('planner route', () => {
  it('exports an express router', () => {
    expect(plannerRoute).toBeDefined();
    // Express routers expose a stack array of routes
    expect(plannerRoute.stack).toBeDefined();
  });
});
