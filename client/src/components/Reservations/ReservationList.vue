<template>
  <div class="reservations-list">
    <div v-if="props.loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement...
    </div>

    <div v-else-if="!props.reservations.length" class="empty">
      <i class="fas fa-inbox"></i>
      Aucune réservation trouvée
    </div>

    <div v-else class="list">
      <table>
        <thead>
          <tr>
            <th>Catway</th>
            <th>Client</th>
            <th>Bateau</th>
            <th>Date début</th>
            <th>Date fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in sortedReservations" :key="reservation._id">
            <td>
              <span class="badge catway">{{ reservation.catway?.number || 'N/A' }}</span>
            </td>
            <td>{{ reservation.clientName }}</td>
            <td>{{ reservation.boatName }}</td>
            <td>
              <span class="date">{{ formatDate(reservation.startDate) }}</span>
            </td>
            <td>
              <span class="date">{{ formatDate(reservation.endDate) }}</span>
            </td>
            <td class="actions">
              <button @click="editReservation(reservation)" class="edit-btn">
                <i class="fas fa-edit"></i>
                Modifier
              </button>
              <button @click="deleteReservation(reservation._id)" class="delete-btn">
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
import { ref, onMounted, inject, computed } from 'vue'
import catwaysService from '../../services/catways.service'
import type { ErrorHandler } from '@/components/ErrorHandler.vue'

interface Reservation {
  _id: string
  catway: {
    number: string
  }
  clientName: string
  boatName: string
  startDate: string
  endDate: string
  status: string
}

const props = defineProps<{
  reservations: Reservation[]
  loading: boolean
  error: string
}>()

const emit = defineEmits(['refresh', 'edit'])
const errorHandler = inject<ErrorHandler>('errorHandler')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const sortedReservations = computed(() => {
  return [...props.reservations].sort((a, b) => 
    a.catway.number - b.catway.number
  );
});

const deleteReservation = async (id: string) => {
  if (!confirm('Voulez-vous vraiment supprimer cette réservation ?')) return
  
  try {
    const reservation = props.reservations.find(r => r._id === id)
    if (!reservation) return
    
    await catwaysService.deleteReservation(reservation.catway.number, id)
    emit('refresh')
  } catch (err: any) {
    errorHandler?.showError(err)
  }
}

const editReservation = (reservation: Reservation) => {
  emit('edit', reservation)
}
</script>

<style scoped>
.reservations-list {
  width: 100%;
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

.delete-btn:hover {
  background-color: #c0392b;
}

.loading, .empty {
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

.empty {
  color: #666;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge.catway {
  background-color: #ecfdf5;
  color: #047857;
}

.date {
  color: #666;
  font-size: 0.9rem;
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
