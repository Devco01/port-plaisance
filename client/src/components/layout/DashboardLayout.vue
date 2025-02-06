<template>
  <div class="dashboard-layout">
    <Header />
    <main>
      <div class="user-info">
        <p>{{ currentDate }}</p>
        <p>{{ user?.email }}</p>
      </div>
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Header from './Header.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const currentDate = new Date().toLocaleDateString('fr-FR')
</script>
