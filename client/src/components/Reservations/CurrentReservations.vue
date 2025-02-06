<template>
  <div class="reservations-content">
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement...
    </div>
    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>
    <div v-else>
      <div v-if="reservations.length === 0" class="no-data">
        <p>Aucune réservation en cours</p>
      </div>
      <table v-else class="reservations-table">
        <thead>
          <tr>
            <th>Catway</th>
            <th>Client</th>
            <th>Bateau</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation._id">
            <td>{{ reservation.catwayNumber }}</td>
            <td>{{ reservation.clientName }}</td>
            <td>{{ reservation.boatName }}</td>
            <td>{{ formatDate(reservation.startDate) }}</td>
            <td>{{ formatDate(reservation.endDate) }}</td>
            <td>
              <span class="status" :class="reservation.status">
                {{ getStatusLabel(reservation.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../services/api.service'
import catwaysService from '../../services/catways.service'
import reservationsService from '../../services/reservations.service'

interface Reservation {
  _id: string
  catwayNumber: string
  clientName: string
  boatName: string
  startDate: string
  endDate: string
  status: string
}

const reservations = ref<Reservation[]>([])
const loading = ref(true)
const error = ref('')

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const loadData = async () => {
  try {
    loading.value = true
    error.value = ''
    console.log('Chargement des réservations...')
    const response = await reservationsService.getCurrent()
    console.log('Réponse API:', response)
    reservations.value = response.data || []
    console.log('Réservations chargées:', reservations.value)
  } catch (err) {
    console.error('Erreur lors du chargement des données:', err)
    error.value = 'Erreur lors du chargement des données'
    reservations.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.reservations-content {
  width: 100%;
  overflow-x: auto;
}

.reservations-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.reservations-table th,
.reservations-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.reservations-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #2c3e50;
}

.reservations-table tr:hover {
  background-color: #f8fafc;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status.confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status.cancelled {
  background-color: #f8d7da;
  color: #721c24;
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