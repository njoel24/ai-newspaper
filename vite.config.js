import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  root: "src/ui",
  plugins: [
    react(),
    // Module Federation: Enables React dependency sharing across micro-frontends
    // React will be loaded as a singleton, ensuring all components use the same instance
    // This allows external components to consume shared React without bundling it
    federation({
      name: "ai-newspaper",
      remotes: {
        articleUI: "http://localhost:5173/src/packages/article-ui/dist/remoteEntry.js",
        evaluatorUI: "http://localhost:5174/src/packages/evaluator-ui/dist/remoteEntry.js",
      },
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
        lit: {
          singleton: true,
          requiredVersion: "^3.3.1",
        },
        "@lit/react": {
          singleton: true,
          requiredVersion: "^1.0.2",
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
    }
  },
});
