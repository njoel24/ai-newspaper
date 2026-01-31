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
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1'
        },
        lit: {
          singleton: true,
          requiredVersion: '^3.3.1'
        },
        '@lit/react': {
          singleton: true,
          requiredVersion: '^1.0.2'
        }
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
