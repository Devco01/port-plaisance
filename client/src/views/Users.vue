<template>
  <PageLayout title="Gestion des Utilisateurs">
    <template #header-actions>
      <button @click="showAddForm = true" class="btn-action btn-primary">
        <i class="fas fa-plus"></i> Nouvel Utilisateur
      </button>
    </template>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Chargement...
    </div>
    
    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </div>
    
    <div v-else class="users-grid">
      <div v-for="user in users" 
           :key="user.email" 
           class="user-card">
        <div class="user-header">
          <span class="username">{{ user.username }}</span>
          <span :class="['role-badge', `role-${user.role}`]">
            {{ getRoleLabel(user.role) }}
          </span>
        </div>
        <div class="user-body">
          <p class="user-info">
            <i class="fas fa-envelope"></i> {{ user.email }}
          </p>
          <p class="user-info" v-if="user.nom || user.prenom">
            <i class="fas fa-id-card"></i> {{ user.prenom }} {{ user.nom }}
          </p>
          <div class="actions">
            <button @click="editUser(user)" class="btn-action btn-edit">
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button @click="confirmDelete(user)" class="btn-action btn-delete">
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <template #header>
        <h3>{{ isEditing ? 'Modifier' : 'Créer' }} un utilisateur</h3>
      </template>
      <template #body>
        <UserForm 
          :user="selectedUser"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </template>
    </Modal>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import Modal from '@/components/common/Modal.vue'
import UserForm from '@/components/Users/UserForm.vue'
import { getUsers, createUser, updateUser, deleteUser } from '@/services/api'

export default defineComponent({
  name: 'UsersView',
  components: {
    PageLayout,
    Modal,
    UserForm
  },
  data() {
    return {
      loading: true,
      error: null,
      users: [],
      showModal: false,
      isEditing: false,
      selectedUser: null
    }
  },
  methods: {
    getRoleLabel(role) {
      switch (role) {
        case 'admin':
          return 'Administrateur'
        case 'user':
          return 'Utilisateur'
        default:
          return 'Rôle inconnu'
      }
    },
    async fetchUsers() {
      try {
        this.loading = true
        const response = await getUsers()
        this.users = response.data.data
      } catch (e) {
        this.error = "Erreur lors du chargement des utilisateurs"
      } finally {
        this.loading = false
      }
    },
    editUser(user) {
      this.selectedUser = { ...user }
      this.isEditing = true
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedUser = null
      this.isEditing = false
    },
    async handleSubmit(userData) {
      try {
        if (this.isEditing) {
          await updateUser(userData.email, userData)
        } else {
          await createUser(userData)
        }
        await this.fetchUsers()
        this.closeModal()
      } catch (e) {
        this.error = "Erreur lors de la sauvegarde"
      }
    },
    async confirmDelete(user) {
      try {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.username} ?`)) {
          await deleteUser(user.email)
          await this.fetchUsers()
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur')
      }
    }
  },
  mounted() {
    this.fetchUsers()
  }
})
</script>

<style scoped>
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.user-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.user-header {
  background: var(--primary-dark);
  color: white;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.role-admin { 
  background-color: var(--primary-color);
  color: white;
}

.role-user { 
  background-color: var(--secondary-color);
  color: white;
}

.user-body {
  padding: 1rem;
}

.user-info {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-700);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
}
</style> 