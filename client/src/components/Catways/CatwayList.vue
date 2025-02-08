<template>
  <div class="catways-list">
    <div v-if="props.loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement...
    </div>
    <div v-else-if="props.error" class="error">
      {{ props.error }}
    </div>
    <div v-else-if="!props.catways || props.catways.length === 0" class="no-data">
      <i class="fas fa-inbox"></i>
      Aucun catway trouvé
    </div>
    <div v-else class="table-container">
      <table class="catways-table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Type</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="catway in props.catways" :key="catway._id">
            <td>{{ catway.catwayNumber }}</td>
            <td>
              {{ catway.catwayType === 'long' ? 'Long' : 'Court' }}
            </td>
            <td>
              <span class="status" :class="catway.catwayState === 'bon état' ? 'good' : 'warning'">
                {{ catway.catwayState }}
              </span>
            </td>
            <td class="actions">
              <router-link 
                :to="`/catways/${catway.catwayNumber}/reservations`" 
                class="btn-action"
              >
                <i class="fas fa-calendar-alt"></i>
                Réservations
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import CatwayCard from './CatwayCard.vue'

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

defineEmits(['view-reservations'])
</script>

<style scoped>
.catways-list {
  padding: 1rem;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.catways-table {
  width: 100%;
  border-collapse: collapse;
}

.catways-table th,
.catways-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.catways-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.catways-table tr:hover {
  background-color: #f8f9fa;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.error {
  color: #e74c3c;
}

.loading i {
  margin-right: 0.5rem;
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

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.btn-action:hover {
  background-color: #2980b9;
}
</style> 
