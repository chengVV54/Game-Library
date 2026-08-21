import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,  // ← 添加这一行，允许外部访问
    allowedHosts: [
      'localhost',
      '.loca.lt',
      '.ngrok-free.app',
      '.ngrok-free.dev',
      '.ngrok.io',
    ]
  }
})
