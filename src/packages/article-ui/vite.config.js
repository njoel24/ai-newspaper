import { defineConfig } from 'vite';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  plugins: !isStandalone ? [
    federation({
      name: 'article-ui-remote',
      filename: 'remoteEntry.js',
      exposes: {
        './ArticleUI': './ArticleUI.tsx'
      }
    })
  ] : [],
  build: {
    lib: isStandalone ? {
      entry: resolve(__dirname, 'article-ui.tsx'),
      name: 'ArticleUI',
      fileName: 'article-ui.standalone',
      formats: ['es']
    } : {},
    outDir: isStandalone ? 'dist/standalone' : 'dist',
    emptyOutDir: true ,
    sourcemap: true
  }
});
