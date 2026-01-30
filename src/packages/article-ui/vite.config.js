import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'article-ui.tsx'),
      name: 'ArticleUI',
      fileName: 'article-ui',
      formats: ['es']
    },
    rollupOptions: {
      external: ['lit', 'lit/decorators.js', 'react', 'react-dom', 'react-dom/client'],
      output: {
        globals: {
          lit: 'Lit',
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
