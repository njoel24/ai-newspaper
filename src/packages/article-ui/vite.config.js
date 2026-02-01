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
      entry: resolve(__dirname, 'article-ui.tsx'),
      name: 'ArticleUI',
      fileName: 'article-ui.standalone',
      formats: ['es']
    },
    outDir: 'dist/standalone',
    emptyOutDir: true,
    sourcemap: true,
    minify: true
  } : {
    lib: {
      entry: resolve(__dirname, 'ArticleView.tsx'),
      name: 'ArticleView',
      fileName: 'ArticleView',
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
