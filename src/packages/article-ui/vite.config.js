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
  build: isStandalone ? {
    lib: {
      entry: resolve(__dirname, 'article-ui.tsx'),
      name: 'ArticleUI',
      fileName: 'article-ui.standalone',
      formats: ['es']
    },
    outDir: 'dist/standalone',
    emptyOutDir: true,
    sourcemap: true
  } : {
    lib: {
      entry: resolve(__dirname, 'ArticleUI.tsx'),
      name: 'ArticleUI',
      fileName: 'ArticleUI',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
});
