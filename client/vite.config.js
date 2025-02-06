const { defineConfig } = require('vite')
const vue = require('@vitejs/plugin-vue')
const path = require('path')

module.exports = defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: process.env.PORT || 3000,
    strictPort: true,
    host: '0.0.0.0',
    hmr: {
      clientPort: 443,
      host: 'port-plaisance-client.onrender.com'
    }
  },
  preview: {
    port: process.env.PORT || 3000,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: [
      'port-plaisance-client.onrender.com',
      'localhost',
      '.onrender.com'
    ]
  }
}) 