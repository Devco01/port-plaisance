<template>
  <div class="user-form">
    <h3>{{ isEdit ? 'Modifier' : 'Ajouter' }} un Utilisateur</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Nom d'utilisateur :</label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username"
          required
        >
      </div>

      <div class="form-group">
        <label for="email">Email :</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email"
          :disabled="isEdit"
          required
        >
      </div>

      <div class="form-group" v-if="!isEdit">
        <label for="password">Mot de passe :</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password"
          required
          minlength="6"
        >
      </div>

      <div class="error" v-if="error">{{ error }}</div>

      <div class="form-actions">
        <button type="submit">{{ isEdit ? 'Modifier' : 'Ajouter' }}</button>
        <button type="button" @click="$emit('cancel')">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { createUser, updateUser } from '@/services/api'

export default {
  name: 'UserForm',
  props: {
    user: {
      type: Object,
      default: () => ({
        username: '',
        email: '',
        password: ''
      })
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({ ...props.user })
    const error = ref('')

    const handleSubmit = async () => {
      try {
        if (props.isEdit) {
          await updateUser(form.value.email, form.value)
        } else {
          await createUser(form.value)
        }
        emit('submit')
      } catch (err) {
        error.value = 'Erreur lors de la sauvegarde'
      }
    }

    return {
      form,
      error,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.user-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  color: red;
  margin: 10px 0;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button:hover {
  opacity: 0.8;
}
</style> 