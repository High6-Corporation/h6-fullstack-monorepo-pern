import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import { config } from "dotenv"

config({ path: path.resolve(process.cwd(), "../../.env"), override: true })

const API_TARGET =
  // process.env.VITE_API_PROXY_TARGET ?? "http://127.0.0.1:3006"
  process.env.VITE_API_PROXY_TARGET

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    headers: {
      "Cache-Control": "no-store",
    },
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
