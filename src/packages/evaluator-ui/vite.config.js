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
        // Externalize React, React-DOM, and Lit
        if (id.match(/^react($|\/)/) || id.match(/^react-dom($|\/)/) || id.match(/^lit($|\/)/) || id === 'lit') return true;
        return false;
      }
    },
    outDir: isStandalone ? 'dist/standalone' : 'dist',
    emptyOutDir: isStandalone ? true : false,
    sourcemap: true
  }
});
