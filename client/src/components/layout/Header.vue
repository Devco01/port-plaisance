<template>
  <header class="header">
    <nav>
      <router-link to="/dashboard">Tableau de bord</router-link>
      <router-link to="/catways">Catways</router-link>
      <router-link to="/reservations">Réservations</router-link>
      <router-link to="/users">Utilisateurs</router-link>
      <a href="/api-docs" target="_blank">Documentation API</a>
      <button @click="logout">Déconnexion</button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>
