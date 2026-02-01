import { defineConfig } from 'vite';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  mode: 'production',
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: 'production' } })
  },
  plugins: !isStandalone ? [
    federation({
      name: 'evaluator-ui-remote',
      filename: 'remoteEntry.js',
      exposes: {
        './EvaluatorUI': './EvaluatorUI.tsx'
      },
      shared: {
        react: { singleton: true, strictVersion: false },
        'react-dom': { singleton: true, strictVersion: false },
        'react/jsx-runtime': { singleton: true, strictVersion: false }
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
    sourcemap: true,
    minify: true
  } : {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: '',
    sourcemap: true,
    minify: true,
    rollupOptions: {
      input: resolve(__dirname, 'EvaluatorUI.tsx'),
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        entryFileNames: 'EvaluatorUI.js',
        chunkFileNames: '[name]-[hash].js'
      }
    }
  }
});
