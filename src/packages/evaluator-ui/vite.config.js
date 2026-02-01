import { defineConfig } from 'vite';
import { resolve } from 'path';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  mode: 'production',
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: 'production' } })
  },
  plugins: [],
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
    lib: {
      entry: resolve(__dirname, 'EvaluatorView.tsx'),
      name: 'EvaluatorView',
      fileName: 'EvaluatorView',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: true,
    rollupOptions: {
      external: (id) => {
        // Externalize all React-related imports
        return id === 'react' || 
               id === 'react-dom' || 
               id === 'react-dom/client' ||
               id.startsWith('react/') || 
               id.startsWith('react-dom/');
      }
    }
  }
});
