import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Création de l'application Vue
const app = createApp(App)

// Ajout du store Pinia
app.use(createPinia())

// Ajout du router
app.use(router)

// Montage de l'application
app.mount('#app') 