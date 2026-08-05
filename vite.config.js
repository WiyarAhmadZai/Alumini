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
    // Alumini is fixed to 5174 (MIS-Front uses 5173) so running both at once
    // never collides and each app always lives at a predictable URL. strictPort
    // makes Vite fail loudly instead of silently hopping to another port.
    port: 5174,
    strictPort: true,
    hmr: {
      overlay: false
    },
    proxy: {
      // Backend (php artisan serve) runs on 8000 and listens on IPv4 127.0.0.1.
      // Target 127.0.0.1 EXPLICITLY — never the name "localhost": Node would have
      // to resolve it, and with extra adapters up (VPN / mobile hotspot) that
      // resolves to ::1 or a DNS-hijacked address instead of 127.0.0.1, so every
      // proxied request dies with ECONNREFUSED while online but works offline.
      // Using the literal IP skips DNS entirely and behaves the same either way.
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})