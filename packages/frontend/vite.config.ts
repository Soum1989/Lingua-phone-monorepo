import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5175,  // Changed to 5175 to avoid port conflicts
    strictPort: false,  // Allow fallback to another port if needed
    proxy: {
      '/api': {
        target: 'http://localhost:3002',  // Docker backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})