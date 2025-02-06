import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// Création de l'application Vue
const app = createApp(App)

// Ajout du store Pinia
const pinia = createPinia()
app.use(pinia)

// Ajout du router
app.use(router)

// Montage de l'application
app.mount('#app') 