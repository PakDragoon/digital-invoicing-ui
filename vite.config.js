import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "@svgr/rollup"
import path from "node:path"

export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
