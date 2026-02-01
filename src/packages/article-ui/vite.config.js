import { defineConfig } from 'vite';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

const isStandalone = process.env.STANDALONE === 'true';

export default defineConfig({
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: process.env.NODE_ENV || 'production' } })
  },
  plugins: !isStandalone ? [
    federation({
      name: 'article-ui-remote',
      filename: 'remoteEntry.js',
      exposes: {
        './ArticleUI': './ArticleUI.tsx'
      },
      shared: {
        react: { singleton: true, strictVersion: false },
        'react-dom': { singleton: true, strictVersion: false }
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
    lib: {
      entry: resolve(__dirname, 'ArticleUI.tsx'),
      name: 'ArticleUI',
      fileName: 'ArticleUI',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: true,
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  }
});
