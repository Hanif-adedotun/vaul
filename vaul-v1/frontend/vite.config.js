import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wails from "@wailsio/runtime/plugins/vite";
import { resolve } from "path";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    wails("./bindings"),
    {
      name: "copy-tray-html",
      closeBundle() {
        // Copy tray.html to dist after build
        try {
          copyFileSync(
            resolve(__dirname, "tray.html"),
            resolve(__dirname, "dist/tray.html")
          );
        } catch (err) {
          console.warn("Could not copy tray.html:", err);
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        tray: resolve(__dirname, "tray.html"),
      },
    },
  },
});
