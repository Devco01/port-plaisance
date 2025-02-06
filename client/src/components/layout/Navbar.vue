<template>
  <nav class="navbar">
    <div class="nav-content">
      <router-link to="/dashboard" class="nav-brand">
        Port de Russell
      </router-link>

      <div class="nav-links">
        <router-link to="/dashboard" class="nav-link">
          Tableau de bord
        </router-link>
        <router-link to="/catways" class="nav-link">
          Catways
        </router-link>
        <router-link to="/reservations" class="nav-link">
          Réservations
        </router-link>
        <router-link v-if="isAdmin" to="/users" class="nav-link">
          Utilisateurs
        </router-link>
        <a 
          href="http://localhost:5000/api-docs" 
          target="_blank" 
          rel="noopener noreferrer"
          class="nav-link"
        >
          Documentation API
        </a>
        <button @click="handleLogout" class="logout-btn">
          Se déconnecter
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from "../../services/auth.service"

const router = useRouter()
const isAdmin = ref(false)

const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    return JSON.parse(userStr)
  } catch (error) {
    console.error('Erreur lors de la lecture des données utilisateur:', error)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return null
  }
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

onMounted(() => {
  const user = getUserFromStorage()
  isAdmin.value = user?.role === 'admin' || false
})
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 0;
  color: white;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #3498db;
}

.router-link-active {
  color: #3498db;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background-color: #c0392b;
}
</style> 