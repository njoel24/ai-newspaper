import { defineConfig } from 'vite';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  plugins: !isStandalone ? [
    federation({
      name: 'evaluator-ui-remote',
      filename: 'remoteEntry.js',
      exposes: {
        './EvaluatorUI': './EvaluatorUI.tsx'
      }
    })
  ] : [],
  build: {
    lib: isStandalone ? {
      entry: resolve(__dirname, 'evaluator-ui.tsx'),
      name: 'EvaluatorUI',
      fileName: 'evaluator-ui.standalone',
      formats: ['es']
    } : {},
    outDir: isStandalone ? 'dist/standalone' : 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
