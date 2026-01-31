import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  root: "src/ui",
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: process.env.NODE_ENV || 'production' } })
  },
  plugins: [
    react(),
    federation({
      name: 'ai-newspaper',
      remotes: {
        articleUI: 'http://localhost:3000/src/packages/article-ui/dist/remoteEntry.js',
        evaluatorUI: 'http://localhost:3000/src/packages/evaluator-ui/dist/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        'react-dom': { singleton: true, eager: true, requiredVersion: false }
      }
    })
  ],
  build: {
    outDir: "../../dist/ui",
    emptyOutDir: false,
    sourcemap: true,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/ui/index.html"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // proxy backend API
    }
  },
});
