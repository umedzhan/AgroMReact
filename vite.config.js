import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.agrom24.uz',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://api.agrom24.uz',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

