import { defineConfig } from 'vite';
import { resolve } from 'path';

const isStandalone = process.env.STANDALONE === 'true';
const isReact = process.env.REACT === 'true';

const rewriteImportsPlugin = {
  name: 'rewrite-imports',
  renderChunk(code) {
    if (isReact) {
      // Rewrite relative imports to absolute paths
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
      entry: isReact 
        ? resolve(__dirname, 'ArticleUI.tsx')
        : resolve(__dirname, 'article-ui.tsx'),
      name: isReact ? 'ArticleUIReact' : 'ArticleUI',
      fileName: isStandalone 
        ? 'article-ui.standalone' 
        : isReact ? 'ArticleUI' : 'article-ui',
      formats: ['es']
    },
    rollupOptions: isStandalone ? {} : {
      external: (id) => {
        // Don't externalize the entry file itself
        if (id.endsWith('ArticleUI.tsx')) return false;
        // For React wrapper builds, externalize everything except entry file
        if (isReact) {
          // Externalize all dependencies
          return !id.endsWith('ArticleUI.tsx');
        }
        // For web component builds, only externalize npm packages
        if (id.match(/^(@lit\/react|lit|react|react-dom|@babel)/)) return true;
        return false;
      },
      output: {
        plugins: [rewriteImportsPlugin]
      }
    },
    outDir: isStandalone ? 'dist/standalone' : 'dist',
    emptyOutDir: isStandalone || isReact ? false : true,
    sourcemap: true
  }
});
