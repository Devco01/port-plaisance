<template>
  <PageLayout>
    <div class="catway-details">
      <div class="header">
        <h1>Détails du Catway {{ catwayNumber }}</h1>
        <div class="actions" v-if="isAdmin">
          <button @click="showEditModal = true" class="btn-edit">
            <i class="fas fa-edit"></i>
            Modifier
          </button>
          <button @click="handleDelete" class="btn-delete">
            <i class="fas fa-trash"></i>
            Supprimer
          </button>
        </div>
      </div> 

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Chargement...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else-if="!catway" class="no-data">
        Catway non trouvé
      </div>
      <div v-else class="details-card">
        <div class="detail-row">
          <span class="label">Numéro:</span>
          <span class="value">{{ catway.catwayNumber }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Type:</span>
          <span class="value">{{ catway.catwayType === 'long' ? 'Long' : 'Court' }}</span>
        </div>
        <div class="detail-row">
          <span class="label">État:</span>
          <span class="status" :class="catway.catwayState === 'bon état' ? 'good' : 'warning'">
            {{ catway.catwayState }}
          </span>
        </div>
      </div>
    </div>

    <CatwayForm
      v-if="showEditModal"
      :catway="catway"
      @close="showEditModal = false"
      @updated="handleEdit"
    />

    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Supprimer le catway"
      message="Êtes-vous sûr de vouloir supprimer ce catway ?"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PageLayout } from '@/components/Layout'
import CatwayForm from '@/components/Catways/CatwayForm.vue'
import ConfirmDialog from '@/components/Common/ConfirmDialog.vue'
import catwaysService from '@/services/catways.service'

const route = useRoute()
const router = useRouter()
const catwayNumber = route.params.id
const catway = ref(null)
const loading = ref(true)
const error = ref('')
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const isAdmin = ref(false)

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  isAdmin.value = user.role === 'admin'
  
  try {
    const response = await catwaysService.getOne(catwayNumber as string)
    if (response.success) {
      catway.value = response.data
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const handleEdit = async () => {
  showEditModal.value = false
  // Recharger les données
  try {
    const response = await catwaysService.getOne(catwayNumber as string)
    if (response.success) {
      catway.value = response.data
    }
  } catch (err: any) {
    error.value = err.message
  }
}

const handleDelete = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await catwaysService.delete(catwayNumber as string)
    router.push('/catways')
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<style scoped>
.catway-details {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.details-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-row {
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.label {
  width: 120px;
  font-weight: 600;
  color: #2c3e50;
}

.value {
  flex: 1;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: white;
}

.btn-edit {
  background-color: #3498db;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.status.good {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status.warning {
  background-color: #fff3e0;
  color: #ef6c00;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}
</style> 