<template>
  <PageLayout>
    <template #header>
      <h1>Gestion des Catways</h1>
      <button v-if="isAdmin" @click="showAddModal = true" class="add-btn">
        <i class="fas fa-plus"></i>
        Ajouter un catway
      </button>
    </template>

    <CatwayList 
      :catways="catways" 
      :loading="loading"
      :error="error"
      @refresh="fetchCatways"
    />

    <AddCatwayModal 
      v-if="showAddModal" 
      @close="showAddModal = false"
      @catway-added="handleCatwayAdded"
    />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { PageLayout } from '@/components/Layout'
import CatwayList from '@/components/Catways/CatwayList.vue'
import AddCatwayModal from '@/components/Catways/AddCatwayModal.vue'
import catwaysService from '@/services/catways.service'
import type { ErrorHandler } from '@/components/ErrorHandler.vue'

interface Catway {
  _id: string;
  catwayNumber: number;
  catwayType: 'long' | 'short';
  catwayState: string;
}

const catways = ref<Catway[]>([])
const loading = ref(true)
const error = ref('')
const showAddModal = ref(false)
const isAdmin = ref(false)
const errorHandler = inject<ErrorHandler>('errorHandler')

const fetchCatways = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await catwaysService.getAll();
    console.log('Réponse du serveur:', response);
    if (response.success) {
      console.log('Données reçues:', response.data);
      catways.value = response.data;
    } else {
      error.value = 'Erreur lors du chargement des catways';
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des catways';
    console.error('Erreur détaillée:', err);
  } finally {
    loading.value = false;
  }
}

const handleCatwayAdded = () => {
  showAddModal.value = false
  fetchCatways()
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  isAdmin.value = user.role === 'admin'
  fetchCatways()
})
</script>

<style scoped>
.add-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.add-btn:hover {
  background-color: #3aa876;
}
</style> 