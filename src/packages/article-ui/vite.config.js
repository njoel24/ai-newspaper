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
        // Externalize lit, @lit/react, react, react-dom (provided by Module Federation)
        if (id === 'lit' || id.match(/^lit\//)) return true;
        if (id === '@lit/react' || id.match(/^@lit\/react\//)) return true;
        if (id.match(/^react($|\/)/) || id.match(/^react-dom($|\/)/)) return true;
        return false;
      }
    },
    outDir: isStandalone ? 'dist/standalone' : 'dist',
    emptyOutDir: isStandalone ? true : false,
    sourcemap: true
  }
});
