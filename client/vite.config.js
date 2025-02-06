import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  server: {
    port: process.env.PORT || 3000,
    host: true
  },
  preview: {
    port: process.env.PORT || 3000,
    host: true,
    allowedHosts: [
      'port-plaisance-client.onrender.com',
      'localhost',
      '*.onrender.com',
      '.onrender.com'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'esnext'
  }
}) 