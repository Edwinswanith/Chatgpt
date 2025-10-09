import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: ['https://6h82fbwn-5173.inc1.devtunnels.ms/'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    },
    allowedHosts: ['https://6h82fbwn-5173.inc1.devtunnels.ms/']
  }
})
