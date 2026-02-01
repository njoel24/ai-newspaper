import { defineConfig } from 'vite';
import { resolve } from 'path';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  mode: 'production',
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: 'production' } })
  },
  build: isStandalone ? {
    rollupOptions: {
      input: resolve(__dirname, 'evaluator-ui.tsx'),
      output: {
        entryFileNames: 'evaluator-ui.standalone.js',
        format: 'es'
      }
    },
    outDir: 'dist/standalone',
    emptyOutDir: true,
    sourcemap: true,
    minify: true
  } : {
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'evaluator-ui.js'
      },
      external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
      treeshake: true
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: true
  }
});
