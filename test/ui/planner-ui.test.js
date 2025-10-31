import { describe, it, expect } from 'vitest';

// Provide minimal DOM globals so the module can be imported in a Node test env
global.HTMLElement = global.HTMLElement || class {};
global.customElements = global.customElements || { define: () => {}, get: () => undefined };

import('../../src/ui/components/planner-ui/planner-ui.js');

describe('planner-ui web component', () => {
  it('module imports without throwing and exports PlannerUI class', async () => {
    const mod = await import('../../src/ui/components/planner-ui/planner-ui.js');
    expect(mod).toBeTruthy();
    expect(mod.PlannerUI).toBeDefined();
  });
});
