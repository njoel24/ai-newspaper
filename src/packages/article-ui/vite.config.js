import { defineConfig } from 'vite';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  mode: 'production',
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: 'production' } })
  },
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
    sourcemap: true,
    minify: true
  } : {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: '',
    sourcemap: true,
    minify: true,
    rollupOptions: {
      input: resolve(__dirname, 'ArticleUI.tsx'),
      output: {
        entryFileNames: 'ArticleUI.js',
        chunkFileNames: '[name]-[hash].js'
      }
    }
  }
});
