import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Look for tests in the test/ directory
    include: ['test/**/*.test.{js,mjs,cjs,ts,mts,cts}', 'test/**/*.spec.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['node_modules', '.git'],
    // Use node environment to avoid native ESM-only jsdom + parse5 issues
    environment: 'node',
    globals: true,
    // Run in a single thread to avoid flakiness in constrained CI
    threads: false,
    // Increase timeout for slow CI or envs
    testTimeout: 5000,
  },
});
