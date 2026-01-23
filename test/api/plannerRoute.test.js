import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('planner route', () => {
  it('declares a GET /api/agents/planner route in server', () => {
    const serverSource = fs.readFileSync('src/server.ts', 'utf8');
    expect(serverSource.includes("app.get('/api/agents/planner'")).toBe(true);
  });
});
