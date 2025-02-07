<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="title">{{ isEdit ? 'Modifier' : 'Ajouter' }} un utilisateur</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
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
            :disabled="isEdit"
            placeholder="email@exemple.com"
          />
        </div>

        <div class="form-group">
          <label for="password">
            {{ isEdit ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe' }}
          </label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            :required="!isEdit"
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

        <div class="field is-grouped">
          <div class="control">
            <button type="submit" class="button is-primary">
              {{ isEdit ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="$emit('close')">
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import usersService from '../../services/users.service'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => props.isEdit)
const loading = ref(false)
const error = ref('')

const formData = ref({
  username: '',
  email: '',
  password: '',
  role: 'user'
})

onMounted(() => {
  if (props.isEdit && props.user) {
    formData.value = {
      ...formData.value,
      ...props.user
    }
  }
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const payload = { ...formData.value }
    if (isEdit.value && !payload.password) {
      delete payload.password
    }
    
    if (isEdit.value && props.user) {
      await usersService.update(props.user.email, payload)
    } else {
      await usersService.create(payload)
    }
    
    emit('submit', formData.value)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.field.is-grouped {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.button.is-primary {
  background-color: #3498db;
  color: white;
  transition: background-color 0.2s ease;
}

.button.is-primary:hover {
  background-color: #2980b9;
}

.button:not(.is-primary) {
  background-color: #6c757d;
  color: white;
  transition: background-color 0.2s ease;
}

.button:not(.is-primary):hover {
  background-color: #5a6268;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}
</style>
