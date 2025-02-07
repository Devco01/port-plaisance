<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import type { ErrorHandler } from '@/components/ErrorHandler.vue'

const router = useRouter()
const errorHandler = inject<ErrorHandler>('errorHandler')

onMounted(() => {
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler?.showError({
      message: 'Une erreur inattendue est survenue',
      data: event.reason
    })
  })
})
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
