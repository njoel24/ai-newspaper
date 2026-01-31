import { defineConfig } from 'vite';
import { resolve } from 'path';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  build: {
    lib: {
      entry: isStandalone 
        ? resolve(__dirname, 'article-ui.tsx')
        : resolve(__dirname, 'ArticleUI.tsx'),
      name: 'ArticleUI',
      fileName: isStandalone ? 'article-ui.standalone' : 'ArticleUI',
      formats: ['es']
    },
    rollupOptions: isStandalone ? {} : {
      external: (id) => {
        // Don't externalize the entry file itself
        if (id.endsWith('ArticleUI.tsx')) return false;
        // Externalize all dependencies for wrapper builds
        return !id.endsWith('ArticleUI.tsx');
      }
    },
    outDir: isStandalone ? 'dist/standalone' : 'dist',
    emptyOutDir: isStandalone ? true : false,
    sourcemap: true
  }
});
