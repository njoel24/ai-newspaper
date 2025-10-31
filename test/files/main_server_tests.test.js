import { describe, it, expect } from 'vitest';
import fs from 'fs';

const main = fs.readFileSync('src/main.js', 'utf8');
const server = fs.readFileSync('src/server.js', 'utf8');

describe('main and server files', () => {
  it('main calls runOrchestratorAgent', () => {
    expect(main).toMatch(/runOrchestratorAgent/);
  });

  it('server sets up express routes', () => {
    expect(server).toMatch(/app.use\(/);
  });
});
