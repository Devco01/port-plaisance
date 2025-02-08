<template>
  <PageLayout>
    <div class="catways-view">
      <div class="header">
        <h1>Gestion des Catways</h1>
        <button v-if="isAdmin" @click="showForm = true" class="btn-action btn-add">
          <i class="fas fa-plus"></i>
          Ajouter
        </button>
      </div>

      <CatwayList 
        :catways="catways"
        :loading="loading"
        :error="error"
        :isAdmin="isAdmin"
        @edit-catway="handleEdit"
        @delete-catway="handleDelete"
      />

      <CatwayForm
        v-if="showForm"
        :catway="selectedCatway"
        @close="closeForm"
        @created="handleCreated"
        @updated="handleUpdated"
      />

      <ConfirmDialog
        v-if="showDeleteConfirm"
        title="Supprimer le catway"
        message="Êtes-vous sûr de vouloir supprimer ce catway ?"
        @confirm="confirmDelete"
        @cancel="showDeleteConfirm = false"
      />
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PageLayout } from '@/components/Layout'
import CatwayList from '@/components/Catways/CatwayList.vue'
import CatwayForm from '@/components/Catways/CatwayForm.vue'
import ConfirmDialog from '@/components/Common/ConfirmDialog.vue'
import catwaysService from '@/services/catways.service'

const catways = ref([])
const loading = ref(true)
const error = ref('')
const isAdmin = ref(false)
const showForm = ref(false)
const showDeleteConfirm = ref(false)
const selectedCatway = ref(null)
const catwayToDelete = ref(null)

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  isAdmin.value = user.role === 'admin'
  fetchCatways()
})

const fetchCatways = async () => {
  try {
    loading.value = true
    const response = await catwaysService.getAll()
    if (response.success) {
      catways.value = response.data
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const closeForm = () => {
  showForm.value = false
  selectedCatway.value = null
}

const handleCreated = () => {
  closeForm()
  fetchCatways()
}

const handleUpdated = () => {
  closeForm()
  fetchCatways()
}

const handleEdit = (catway: any) => {
  selectedCatway.value = catway
  showForm.value = true
}

const handleDelete = (catway: any) => {
  catwayToDelete.value = catway
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!catwayToDelete.value) return
  
  try {
    await catwaysService.delete(catwayToDelete.value.catwayNumber)
    fetchCatways()
  } catch (err: any) {
    error.value = err.message
  } finally {
    showDeleteConfirm.value = false
    catwayToDelete.value = null
  }
}
</script>

<style scoped>
.catways-view {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-action {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: white;
  text-transform: uppercase;
  font-weight: 500;
  background-color: #3498db;
}

.btn-action:hover {
  background-color: #2980b9;
}
</style> 