<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            required
            placeholder="Nom d'utilisateur"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            :disabled="isEditing"
            placeholder="email@exemple.com"
          />
        </div>

        <div class="form-group">
          <label for="password">
            {{ isEditing ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe' }}
          </label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            :required="!isEditing"
            placeholder="Mot de passe"
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="role">Rôle</label>
          <select
            id="role"
            v-model="formData.role"
            required
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeModal">
            Annuler
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import usersService from '../../services/users.service'

const props = defineProps<{
  user?: {
    _id: string
    username: string
    email: string
    role: string
  }
}>()

const emit = defineEmits(['close', 'created', 'updated'])

const isEditing = computed(() => !!props.user)
const loading = ref(false)
const error = ref('')

const formData = ref({
  username: '',
  email: '',
  password: '',
  role: 'user'
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const payload = { ...formData.value }
    if (isEditing.value && !payload.password) {
      delete payload.password
    }
    
    if (isEditing.value && props.user) {
      await usersService.update(props.user.email, payload)
      emit('updated')
    } else {
      await usersService.create(payload)
      emit('created')
    }
    
    closeModal()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

// Initialisation du formulaire en mode édition
if (props.user) {
  formData.value = {
    username: props.user.username,
    email: props.user.email,
    password: '',
    role: props.user.role
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.submit-btn {
  background-color: #42b983;
  color: white;
}

.submit-btn:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}
</style>
