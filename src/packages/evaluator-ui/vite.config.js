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
        /from\s+["']\.\/evaluator-ui\.[^"']*["']/g,
        'from "/src/packages/evaluator-ui/dist/evaluator-ui.js"'
      );
    }
    return code;
  }
};

export default defineConfig({
  build: {
    lib: {
      entry: isReact 
        ? resolve(__dirname, 'EvaluatorUI.tsx')
        : resolve(__dirname, 'evaluator-ui.tsx'),
      name: isReact ? 'EvaluatorUIReact' : 'EvaluatorUI',
      fileName: isStandalone 
        ? 'evaluator-ui.standalone' 
        : isReact ? 'EvaluatorUI' : 'evaluator-ui',
      formats: ['es']
    },
    rollupOptions: isStandalone ? {} : {
      external: (id) => {
        // Don't externalize the entry file itself
        if (id.endsWith('EvaluatorUI.tsx')) return false;
        // For React wrapper builds, externalize everything except entry file
        if (isReact) {
          // Externalize all dependencies
          return !id.endsWith('EvaluatorUI.tsx');
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
