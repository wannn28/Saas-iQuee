import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from the root of https://saas.iquee.tech (serve with SPA fallback to index.html)
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
})
