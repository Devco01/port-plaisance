<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <main class="main-content">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <slot></slot>
    </main>
    <ErrorHandler ref="errorHandler" />
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
import ErrorHandler from '../ErrorHandler.vue'
import { ref, onMounted, provide } from 'vue'

const errorHandler = ref()
const error = ref('')

provide('errorHandler', errorHandler)

onMounted(() => {
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.value?.showError(event.reason)
  })
})
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
}
</style>
