import { defineConfig } from 'vite';
import { resolve } from 'path';

const isStandalone = process.env.STANDALONE === 'true';

const rewriteImportsPlugin = {
  name: 'rewrite-imports',
  renderChunk(code) {
    if (!isStandalone) {
      // Rewrite relative imports to absolute paths for wrapper builds
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
      entry: isStandalone 
        ? resolve(__dirname, 'evaluator-ui.tsx')
        : resolve(__dirname, 'EvaluatorUI.tsx'),
      name: 'EvaluatorUI',
      fileName: isStandalone ? 'evaluator-ui.standalone' : 'EvaluatorUI',
      formats: ['es']
    },
    rollupOptions: isStandalone ? {} : {
      external: (id) => {
        // Don't externalize the entry file itself
        if (id.endsWith('EvaluatorUI.tsx')) return false;
        // Externalize all dependencies for wrapper builds
        return !id.endsWith('EvaluatorUI.tsx');
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
