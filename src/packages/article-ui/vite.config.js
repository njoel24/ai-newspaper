import { defineConfig } from 'vite';
import { resolve } from 'path';

const isStandalone = process.env.STANDALONE === 'true';

const rewriteImportsPlugin = {
  name: 'rewrite-imports',
  renderChunk(code) {
    if (!isStandalone) {
      // Rewrite relative imports to absolute paths for wrapper builds
      return code.replace(
        /from\s+["']\.\/article-ui\.[^"']*["']/g,
        'from "/src/packages/article-ui/dist/article-ui.js"'
      );
    }
    return code;
  }
};

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
      },
      output: {
        plugins: [rewriteImportsPlugin]
      }
    },
    outDir: isStandalone ? 'dist/standalone' : 'dist',
    emptyOutDir: isStandalone ? true : false,
    sourcemap: true
  }
});
