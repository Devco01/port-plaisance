<template>
  <div class="home">
    <div class="content-container">
      <!-- Section présentation -->
      <div class="presentation-section">
        <h1>Port de Russell</h1>
        <div class="description">
          <p>Bienvenue sur l'application de gestion du Port de Russell.</p>
          <p>Cette plateforme permet la gestion des réservations de catways et l'administration du port de plaisance.</p>
        </div>
        <div class="features">
          <div class="feature">
            <i class="fas fa-ship"></i>
            <h3>Gestion des Catways</h3>
            <p>Suivez l'état et la disponibilité des emplacements</p>
          </div>
          <div class="feature">
            <i class="fas fa-calendar-check"></i>
            <h3>Réservations</h3>
            <p>Gérez les réservations des places de port</p>
          </div>
          <div class="feature">
            <i class="fas fa-book"></i>
            <h3>Documentation API</h3>
            <p>Accédez à la documentation complète de l'API</p>
          </div>
        </div>
      </div>

      <!-- Section connexion -->
      <div class="auth-section">
        <div class="auth-box">
          <h2>Connexion</h2>
          <form @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder="Email"
              >
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                placeholder="Mot de passe"
              >
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading">Connexion...</span>
              <span v-else>Se connecter</span>
            </button>
          </form>

          <div class="api-docs-link">
            <a :href="`${apiBaseUrl}/api-docs`" target="_blank">
              <i class="fas fa-book"></i> Accéder à la documentation API
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const apiBaseUrl = import.meta.env.VITE_APP_API_URL

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (!email.value || !password.value) {
      error.value = 'Veuillez remplir tous les champs'
      return
    }
    
    await authStore.login(email.value, password.value)
  } catch (err) {
    error.value = 'Email ou mot de passe incorrect'
    console.error('Erreur de connexion:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  padding: 2rem;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: center;
}

.presentation-section {
  color: white;
  padding: 2rem;
}

.presentation-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.description {
  font-size: 1.1rem;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.feature {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.feature i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature h3 {
  margin-bottom: 0.5rem;
}

.auth-section {
  width: 100%;
}

.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.auth-box h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  color: var(--gray-700);
  font-weight: 500;
}

input {
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
}

.error-message {
  color: red;
  margin-bottom: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.api-docs-link {
  margin-top: 1.5rem;
  text-align: center;
}

.api-docs-link a {
  color: var(--primary-color);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.api-docs-link a:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .presentation-section {
    text-align: center;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style> 