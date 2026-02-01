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
      input: resolve(__dirname, 'article-ui.tsx'),
      output: {
        entryFileNames: 'article-ui.standalone.js',
        format: 'es'
      }
    },
    outDir: 'dist/standalone',
    emptyOutDir: true,
    sourcemap: true,
    minify: true
  } : {
    rollupOptions: {
      input: resolve(__dirname, 'ArticleView.tsx'),
      output: {
        entryFileNames: 'ArticleView.js',
        format: 'es'
      },
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime']
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: true
  }
});
