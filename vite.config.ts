import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",

      manifest: {
        name: "Crypto Price Alert",
        short_name: "Crypto Price Alert",
        description: "Crypto Price Alert",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "favicon.svg",
            sizes: "150x150",
            type: "image/svg",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },

      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  server: {
    watch: {
      ignored: ["**/node_modules/**", "**/dist/**"],
    },
  },
});
