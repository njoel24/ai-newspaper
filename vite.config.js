import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  mode: 'production',
  root: "src/ui",
  define: {
    'globalThis.process': JSON.stringify({ env: { NODE_ENV: 'production' } })
  },
  plugins: [
    react()
  ],
  build: {
    outDir: "../../dist/ui",
    emptyOutDir: false,
    sourcemap: true,
    target: "esnext",
    minify: true,
    cssCodeSplit: false,
    cssMinify: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/ui/index.html"),
      external: (id) => {
        // Externalize React packages - provided by import map
        if (id === 'react' || id === 'react-dom' || id === 'react-dom/client' || id.startsWith('react/') || id.startsWith('react-dom/')) {
          return true;
        }
        // Externalize package dist files - they'll be loaded at runtime
        return id.startsWith('/src/packages/');
      }
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // proxy backend API
    }
  },
});
