import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';

export default defineConfig({
  mode: 'production',
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: 'production' } }),
  },
  plugins: [
    federation({
      name: 'article_ui',
      filename: 'remoteEntry.js',
      dts: false,
      exposes: {
        './ArticleUI': './article-ui.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
        lit: { singleton: true, requiredVersion: '^3.3.1' },
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: true,
    sourcemap: true,
  },
});
