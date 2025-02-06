<template>
  <div class="user-list">
    <div class="header">
      <h2>Liste des Utilisateurs</h2>
      <button @click="showAddForm = true" class="btn-primary">
        <i class="fas fa-plus"></i> Nouvel Utilisateur
      </button>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Nom d'utilisateur</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Date de création</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}</td>
          <td>{{ formatDate(user.createdAt || '') }}</td>
          <td class="actions">
            <button @click="editUser(user)" class="btn-icon">
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="confirmDelete(user)" 
              class="btn-icon delete"
              :disabled="user._id === currentUser?._id"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal pour ajouter/éditer -->
    <div v-if="showAddForm || editingUser" class="modal">
      <div class="modal-content">
        <h3>{{ editingUser ? 'Modifier' : 'Ajouter' }} un utilisateur</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              required
            >
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              required
              :disabled="!!editingUser"
            >
          </div>

          <div class="form-group" v-if="!editingUser">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              required
              minlength="6"
            >
          </div>

          <div class="form-group">
            <label for="role">Rôle</label>
            <select
              id="role"
              v-model="formData.role"
              required
              :disabled="editingUser?._id === currentUser?._id"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-primary">
              {{ editingUser ? 'Modifier' : 'Ajouter' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { getUsers, createUser, updateUser, deleteUser } from '@/services/api'
import type { User } from '@/types/api'

interface UserFormData {
  username: string;
  email: string;
  password?: string;
  role: "user" | "admin";
}

export default defineComponent({
  name: 'UserList',
  setup() {
    const store = useStore()
    const users = ref<User[]>([])
    const loading = ref(false)
    const error = ref('')
    const showAddForm = ref(false)
    const editingUser = ref<User | null>(null)
    const formData = ref<UserFormData>({
      username: '',
      email: '',
      password: '',
      role: 'user'
    })

    const currentUser = computed(() => store.state.user)

    const loadUsers = async () => {
      try {
        loading.value = true
        const response = await getUsers()
        users.value = response.data.data
      } catch (err) {
        error.value = 'Erreur lors du chargement des utilisateurs'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      try {
        if (editingUser.value) {
          const { password, ...updateData } = formData.value
          await updateUser(editingUser.value.email, updateData)
        } else {
          await createUser(formData.value)
        }
        await loadUsers()
        closeModal()
      } catch (err) {
        error.value = 'Erreur lors de l\'enregistrement'
        console.error(err)
      }
    }

    const editUser = (user: User) => {
      editingUser.value = user
      formData.value = {
        username: user.username,
        email: user.email,
        role: user.role as "user" | "admin"
      }
    }

    const confirmDelete = async (user: User) => {
      if (user._id === currentUser.value?._id) {
        error.value = 'Vous ne pouvez pas supprimer votre propre compte'
        return
      }

      if (confirm(`Voulez-vous vraiment supprimer l'utilisateur ${user.username} ?`)) {
        try {
          await deleteUser(user.email)
          await loadUsers()
        } catch (err) {
          error.value = 'Erreur lors de la suppression'
          console.error(err)
        }
      }
    }

    const closeModal = () => {
      showAddForm.value = false
      editingUser.value = null
      formData.value = {
        username: '',
        email: '',
        password: '',
        role: 'user'
      }
    }

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }

    loadUsers()

    return {
      users,
      loading,
      error,
      showAddForm,
      editingUser,
      formData,
      currentUser,
      handleSubmit,
      editUser,
      confirmDelete,
      closeModal,
      formatDate
    }
  }
})
</script>

<style scoped>
/* Mêmes styles que CatwayList.vue */
</style> 