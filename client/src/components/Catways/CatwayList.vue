<template>
  <div class="catways-list">
    <div class="header">
      <router-link to="/reservations" class="btn-reservations">
        <i class="fas fa-calendar-alt"></i>
        Réservations
      </router-link>
      <button v-if="isAdmin" @click="$emit('add-catway')" class="btn-add">
        <i class="fas fa-plus"></i>
        Nouveau catway
      </button>
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
            <th class="text-center">État</th>
            <th v-if="isAdmin" class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="catway in filteredCatways" :key="catway._id">
            <td>
              <router-link 
                :to="`/catways/${catway.catwayNumber}`" 
                class="catway-link"
              >
                {{ catway.catwayNumber }}
              </router-link>
            </td>
            <td>{{ catway.catwayType === 'long' ? 'Long' : 'Court' }}</td>
            <td class="text-center">
              <span class="status" :class="catway.catwayState === 'bon état' ? 'good' : 'warning'">
                {{ catway.catwayState }}
              </span>
            </td>
            <td v-if="isAdmin" class="text-right">
              <button 
                @click="$emit('edit-catway', catway)" 
                class="btn-icon"
                title="Modifier"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                @click="$emit('delete-catway', catway)" 
                class="btn-icon delete"
                title="Supprimer"
              >
                <i class="fas fa-trash"></i>
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
  isAdmin: boolean
}>()

defineEmits(['add-catway', 'edit-catway', 'delete-catway'])

const filteredCatways = computed(() => props.catways)
</script>

<style scoped>
.catways-list {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-reservations {
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

.btn-reservations:hover {
  background-color: #2980b9;
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

.text-center {
  text-align: center !important;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
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

.text-right {
  text-align: right !important;
}

.btn-add {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.btn-add:hover {
  background-color: #3aa876;
}

.btn-icon {
  padding: 0.25rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-icon:hover {
  color: #3498db;
}

.btn-icon.delete:hover {
  color: #e74c3c;
}

.catway-link {
  color: #3498db;
  text-decoration: none;
}

.catway-link:hover {
  text-decoration: underline;
}
</style> 
 