<template>
  <div class="users-list">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      Chargement des utilisateurs...
    </div>

    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <div v-else-if="users.length === 0" class="empty">
      <i class="fas fa-inbox"></i>
      Aucun utilisateur trouvé
    </div>

    <div v-else class="list">
      <table>
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th v-if="isAdmin">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.email">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['badge', user.role]">
                {{ user.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
              </span>
            </td>
            <td v-if="isAdmin" class="actions">
              <button @click="editUser(user)" class="edit-btn">
                <i class="fas fa-edit"></i>
                Modifier
              </button>
              <button 
                @click="deleteUser(user.email)"
                class="delete-btn"
                :disabled="user.email === currentUserEmail"
              >
                <i class="fas fa-trash"></i>
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import usersService from '../../services/users.service'

const props = defineProps<{
  users: Array<{
    username: string
    email: string
    role: string
  }>
  loading: boolean
  error: string
}>()

const emit = defineEmits(['refresh'])
const isAdmin = ref(false)
const currentUserEmail = ref('')

const deleteUser = async (email: string) => {
  if (email === currentUserEmail.value) return
  
  if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return
  
  try {
    await usersService.delete(email)
    emit('refresh')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const editUser = (user: any) => {
  emit('edit', user)
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  isAdmin.value = user.role === 'admin'
  currentUserEmail.value = user.email
})
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge.admin {
  background-color: #fdf2f8;
  color: #db2777;
}

.badge.user {
  background-color: #f0f9ff;
  color: #0369a1;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c0392b;
}

.delete-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #e74c3c;
}

@media (max-width: 768px) {
  th, td {
    padding: 0.75rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .edit-btn, .delete-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
