<template>
  <PageLayout>
    <div class="users">
      <div class="page-header">
        <h1>Gestion des Utilisateurs</h1>
        <div class="actions">
          <button v-if="isAdmin" @click="showAddForm = true" class="add-btn">
            <i class="fas fa-plus"></i>
            Nouvel Utilisateur
          </button>
        </div>
      </div>

      <div class="content-card">
        <div class="filters">
          <div class="filter-group">
            <label for="roleFilter">Filtrer par rôle</label>
            <select 
              id="roleFilter"
              v-model="filters.role"
              @change="applyFilters"
            >
              <option value="">Tous les rôles</option>
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>

        <UserList 
          :users="filteredUsers" 
          :loading="loading"
          :error="error"
          @refresh="fetchUsers"
        />
      </div>

      <UserForm
        v-if="showAddForm"
        :user="selectedUser"
        @close="closeForm"
        @created="handleUserCreated"
        @updated="handleUserUpdated"
      />
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { PageLayout } from '@/components/Layout'
import UserList from '@/components/Users/UserList.vue'
import UserForm from '@/components/Users/UserForm.vue'
import usersService from '@/services/users.service'
import type { ErrorHandler } from '@/components/ErrorHandler.vue'

const users = ref([])
const loading = ref(true)
const errorHandler = inject<ErrorHandler>('errorHandler')
const showAddForm = ref(false)
const selectedUser = ref(null)
const isAdmin = ref(false)
const error = ref('')

const filters = ref({
  role: ''
})

const filteredUsers = computed(() => {
  if (!filters.value.role) return users.value
  return users.value.filter(user => user.role === filters.value.role)
})

const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await usersService.getAll()
    users.value = response.data || []
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des utilisateurs'
    console.error('Erreur lors du chargement des utilisateurs:', err)
  } finally {
    loading.value = false
  }
}

const closeForm = () => {
  showAddForm.value = false
  selectedUser.value = null
}

const handleUserCreated = () => {
  try {
    closeForm()
    fetchUsers()
  } catch (err: any) {
    errorHandler?.showError(err)
  }
}

const handleUserUpdated = () => {
  try {
    closeForm()
    fetchUsers()
  } catch (err: any) {
    errorHandler?.showError(err)
  }
}

const applyFilters = () => {
  // Les filtres sont appliqués via le computed filteredUsers
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  isAdmin.value = user.role === 'admin'
  fetchUsers()
})
</script>

<style scoped>
.users {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.content-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #666;
  font-size: 0.9rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 200px;
}

.add-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .users {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .content-card {
    padding: 1rem;
  }
}
</style> 