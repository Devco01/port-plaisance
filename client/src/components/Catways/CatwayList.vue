<template>
  <div class="catways-grid">
    <div v-if="loading" class="loading">
      Chargement...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="catway-cards">
      <div v-if="!catways.length" class="no-data">
        Aucun catway trouvé
      </div>
      <CatwayCard
        v-for="catway in catways"
        :key="catway.catwayNumber"
        :catway="catway"
        @reservations="$emit('view-reservations', catway)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import catwaysService from '@/services/catways.service'
import type { ErrorHandler } from '@/components/ErrorHandler.vue'

interface Catway {
  _id: string;
  catwayNumber: number;
  catwayType: 'long' | 'short';
  catwayState: string;
}

const props = defineProps<{
  catways: Catway[]
  loading: boolean
  error: string
}>()

const emit = defineEmits(['refresh', 'view-reservations'])
const isAdmin = ref(false)
const errorHandler = inject<ErrorHandler>('errorHandler')

const getStatusLabel = (status: string) => {
  const labels = {
    available: 'Disponible',
    occupied: 'Occupé',
    maintenance: 'En maintenance'
  }
  return labels[status as keyof typeof labels] || status
}

const deleteCatway = async (id: string) => {
  if (!confirm('Voulez-vous vraiment supprimer ce catway ?')) return
  
  try {
    await catwaysService.delete(id)
    emit('refresh')
  } catch (err: any) {
    errorHandler?.showError(err)
  }
}

const updateStatus = async (id: string, status: string) => {
  try {
    await catwaysService.update(id, { status })
    emit('refresh')
  } catch (err: any) {
    errorHandler?.showError(err)
  }
}
</script>

<style scoped>
.catway-list {
  padding: 1rem;
}

.loading, .error, .no-catways {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

.catway-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.catway-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.catway-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.catway-header h3 {
  margin: 0;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge.available {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.occupied {
  background-color: #ffebee;
  color: #c62828;
}

.status-badge.maintenance {
  background-color: #fff3e0;
  color: #ef6c00;
}

.catway-details {
  margin-bottom: 1rem;
}

.catway-details p {
  margin: 0.5rem 0;
  color: #666;
}

.catway-actions {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
}

.view-btn:hover {
  background-color: #2980b9;
}
</style> 