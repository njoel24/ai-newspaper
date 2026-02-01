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
    react(),
    {
      name: 'inline-css',
      enforce: 'post',
      generateBundle(options, bundle) {
        // Find CSS assets and inline them into JS
        const cssAssets = Object.keys(bundle).filter(key => key.endsWith('.css'));
        const jsAssets = Object.keys(bundle).filter(key => key.endsWith('.js') && !key.includes('.map'));
        const htmlAssets = Object.keys(bundle).filter(key => key.endsWith('.html'));
        
        if (cssAssets.length > 0 && jsAssets.length > 0) {
          const cssContent = cssAssets.map(key => bundle[key].source).join('\n');
          const jsKey = jsAssets[0];
          
          // Prepend CSS injection code to the JS bundle
          const injectCode = `(function(){const s=document.createElement('style');s.textContent=${JSON.stringify(cssContent)};document.head.appendChild(s);})();`;
          bundle[jsKey].code = injectCode + bundle[jsKey].code;
          
          // Remove CSS <link> tags from HTML
          htmlAssets.forEach(htmlKey => {
            if (bundle[htmlKey].type === 'asset') {
              bundle[htmlKey].source = bundle[htmlKey].source.replace(
                /<link[^>]*rel="stylesheet"[^>]*>/g,
                ''
              );
            }
          });
          
          // Remove CSS files from bundle
          cssAssets.forEach(key => delete bundle[key]);
        }
      }
    }
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
