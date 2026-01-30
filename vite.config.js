import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  root: "src/ui",
  resolve: {
    alias: {
      '@ai-newspaper/article-ui': path.resolve(__dirname, 'src/packages/article-ui/article-ui.tsx'),
    },
  },
  plugins: [
    react(),
    // Module Federation: Enables React dependency sharing across micro-frontends
    // React will be loaded as a singleton, ensuring all components use the same instance
    // This allows external components to consume shared React without bundling it
    federation({
      name: "ai-newspaper",
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.3.1",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.3.1",
        },
        "react-dom/client": {
          singleton: true,
          requiredVersion: "^18.3.1",
        },
      },
    }),
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
    },
  },
});
