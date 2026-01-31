import { defineConfig } from 'vite';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: process.env.NODE_ENV || 'production' } })
  },
  plugins: !isStandalone ? [
    federation({
      name: 'evaluator-ui-remote',
      filename: 'remoteEntry.js',
      exposes: {
        './EvaluatorUI': './EvaluatorUI.tsx'
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false }
      }
    })
  ] : [],
  build: isStandalone ? {
    lib: {
      entry: resolve(__dirname, 'evaluator-ui.tsx'),
      name: 'EvaluatorUI',
      fileName: 'evaluator-ui.standalone',
      formats: ['es']
    },
    outDir: 'dist/standalone',
    emptyOutDir: true,
    sourcemap: true
  } : {
    lib: {
      entry: resolve(__dirname, 'EvaluatorUI.tsx'),
      name: 'EvaluatorUI',
      fileName: 'EvaluatorUI',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
