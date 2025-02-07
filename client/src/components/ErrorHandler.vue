<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loading-content">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement...
    </div>
  </div>
  <div v-if="error" class="error-container">
    <div class="error-content">
      <h3>{{ error.message }}</h3>
      <p v-if="error.status">Status: {{ error.status }}</p>
      <pre v-if="isDev && error.data">{{ JSON.stringify(error.data, null, 2) }}</pre>
      <button @click="clearError">Fermer</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface ErrorHandler {
  showError: (err: { message: string; status?: number; data?: any }) => void;
  clearError: () => void;
  showLoading: () => void;
}

const error = ref<{ message: string; status?: number; data?: any } | null>(null)
const isLoading = ref(false)
const isDev = computed(() => import.meta.env.DEV)

const showError = (err: any) => {
  isLoading.value = false
  error.value = {
    message: err.message || 'Une erreur est survenue',
    status: err.status,
    data: err.data
  }
}

const clearError = () => {
  error.value = null
  isLoading.value = false
}

const showLoading = () => {
  isLoading.value = true
  error.value = null
}

// Exposer les méthodes
defineExpose({
  showError,
  clearError,
  showLoading
})
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  color: #2c3e50;
}

.loading-content i {
  font-size: 1.5rem;
  color: #42b983;
}

.error-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: #fff;
  border: 1px solid #ff4444;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.error-content {
  max-width: 400px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f5f5f5;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #ff0000;
}
</style> 