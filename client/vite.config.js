import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  preview: {
    host: true,
    port: process.env.PORT || 3000,
    strictPort: true,
    allowedHosts: [
      'port-plaisance-client.onrender.com',
      'localhost',
      '.onrender.com'
    ]
  }
}) 