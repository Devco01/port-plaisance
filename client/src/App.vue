<template>
  <div id="app">
    <nav v-if="isAuthenticated" class="main-nav">
      <div class="nav-brand">
        Port de Russell
      </div>
      <div class="nav-links">
        <router-link to="/dashboard" class="nav-link">
          <i class="fas fa-home"></i> Tableau de bord
        </router-link>
        <router-link to="/catways" class="nav-link">
          <i class="fas fa-ship"></i> Catways
        </router-link>
        <router-link to="/reservations" class="nav-link">
          <i class="fas fa-calendar"></i> Réservations
        </router-link>
        <router-link v-if="isAdmin" to="/users" class="nav-link">
          <i class="fas fa-users"></i> Utilisateurs
        </router-link>
        <a :href="`${apiUrl}/api-docs`" target="_blank" class="api-docs-link">
          <i class="fas fa-book"></i> Documentation API
        </a>
        <a href="#" @click.prevent="handleLogout" class="nav-link logout">
          <i class="fas fa-sign-out-alt"></i> Déconnexion
        </a>
      </div>
    </nav>

    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const apiUrl = ref(import.meta.env.VITE_APP_API_URL)

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.userRole === 'admin')

    const handleLogout = async () => {
      try {
        await authStore.logout()
        router.push('/login')
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      }
    }

    return {
      isAuthenticated,
      isAdmin,
      handleLogout,
      apiUrl
    }
  }
})
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: var(--gray-100);
}

.main-content {
  padding: 20px;
}

.main-nav {
  background-color: var(--secondary-color);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
  background: none;
  font-size: inherit;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: var(--primary-color);
}

.nav-link.logout {
  background-color: var(--danger-color);
}

.nav-link.logout:hover {
  opacity: 0.9;
}

.nav-link i {
  font-size: 1.1rem;
}

.api-docs-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--primary-color);
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.api-docs-link:hover {
  background-color: var(--light);
}

.api-docs-link i {
  font-size: 1.1em;
}
</style>
