import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from the root of https://saas.iquee.tech (serve with SPA fallback to index.html).
// Nginx proxies /api/ to the Node API container in production; Vite proxies /api to the local API (server/, port 3005) in dev/preview.
const api = { '/api': { target: 'http://localhost:3005', changeOrigin: false } }

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { proxy: api },
  preview: { proxy: api },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
})
