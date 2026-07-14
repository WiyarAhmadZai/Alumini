import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: true,
    hmr: {
      overlay: false
    },
    proxy: {
      // Backend (php artisan serve) runs on 8000 — must match the axios baseURL
      // in src/config/axios.js. Keep all three in sync (proxy target, axios
      // baseURL, and any absolute storage URLs) or /api requests fail.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})