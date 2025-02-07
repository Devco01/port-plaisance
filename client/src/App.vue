<template>
  <div id="app">
    <ErrorHandler ref="errorHandlerRef" />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import ErrorHandler from '@/components/ErrorHandler.vue'

const router = useRouter()
const errorHandlerRef = ref()

provide('errorHandler', {
  showError: (error: any) => errorHandlerRef.value?.showError(error),
  clearError: () => errorHandlerRef.value?.clearError(),
  showLoading: () => errorHandlerRef.value?.showLoading()
})

onMounted(() => {
  window.addEventListener('unhandledrejection', (event) => {
    errorHandlerRef.value?.showError({
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
