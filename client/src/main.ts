import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useAuthStore } from './stores/auth'

console.log('Démarrage de l\'application...')

// Configuration globale d'axios
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL
axios.defaults.withCredentials = true

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
  response => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Vérifier l'authentification au démarrage
const authStore = useAuthStore()
if (authStore.token) {
  authStore.checkAuth()
}

// Attendre l'initialisation avant de monter l'app
router.isReady().then(() => {
  app.mount('#app')
  console.log('Application montée !')
})
