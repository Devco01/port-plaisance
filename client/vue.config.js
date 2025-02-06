const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true,
        logLevel: 'debug'  // Pour voir les logs du proxy
      }
    }
  },
  // Spécifier le point d'entrée
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html'
    }
  },
  configureWebpack: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
  }
}) 