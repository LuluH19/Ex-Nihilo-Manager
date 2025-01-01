import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/eleve': 'http://localhost:4000',
      '/prof': 'http://localhost:4000',
      '/viescolaire': 'http://localhost:4000'
    }
  }
}) 