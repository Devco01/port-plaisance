const { defineConfig } = require('vite')
const vue = require('@vitejs/plugin-vue')
const path = require('path')

module.exports = defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'views': path.resolve(__dirname, 'src/views')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
}) 