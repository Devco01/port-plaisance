import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import axios from 'axios'

// Création de l'application Vue
const app = createApp(App)

// Ajout du store Pinia
const pinia = createPinia()
app.use(pinia)

// Ajout du router
app.use(router)

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Montage de l'application
app.mount('#app') 