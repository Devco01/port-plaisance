<template>
  <div class="catways-list">
    <div class="filters">
      <div class="filter-group">
        <label>Filtrer par état:</label>
        <select v-model="filterState">
          <option value="">Tous les états</option>
          <option value="bon état">Bon état</option>
          <option value="maintenance">En maintenance</option>
        </select>
      </div>
    </div>

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
    <div v-else class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Catway</th>
            <th>Type</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="catway in filteredCatways" :key="catway._id">
            <td>{{ catway.catwayNumber }}</td>
            <td>{{ catway.catwayType === 'long' ? 'Long' : 'Court' }}</td>
            <td>
              <span class="status" :class="catway.catwayState === 'bon état' ? 'good' : 'warning'">
                {{ catway.catwayState }}
              </span>
            </td>
            <td>
              <button @click="$emit('view-reservations', catway)" class="btn-action">
                <i class="fas fa-calendar-alt"></i>
                Réservations
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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

const router = useRouter()
const filterState = ref('')

const filteredCatways = computed(() => {
  if (!filterState.value) return props.catways
  return props.catways.filter(c => c.catwayState.includes(filterState.value))
})

const goToReservations = (catway: Catway) => {
  router.push(`/catways/${catway.catwayNumber}/reservations`)
}

defineEmits(['view-reservations'])
</script>

<style scoped>
.catways-list {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.filters {
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group label {
  font-weight: 500;
  color: #2c3e50;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.table-responsive {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.table th,
.table td {
  padding: 0.5rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
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

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
}

.status.good {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status.warning {
  background-color: #fff3e0;
  color: #ef6c00;
}

.btn-action {
  padding: 0.25rem 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-action:hover {
  background-color: #2980b9;
}

.btn-action i {
  font-size: 0.875rem;
}
</style> 
