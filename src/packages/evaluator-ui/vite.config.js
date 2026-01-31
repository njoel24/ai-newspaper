import { defineConfig } from 'vite';
import { resolve } from 'path';

const isStandalone = process.env.STANDALONE === 'true';

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
      }
    },
    outDir: isStandalone ? 'dist/standalone' : 'dist',
    emptyOutDir: isStandalone ? true : false,
    sourcemap: true
  }
});
