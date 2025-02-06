<template>
  <div class="current-reservations">
    <div v-if="loading" class="loading">
      Chargement des réservations...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="reservations.length === 0" class="empty">
      Aucune réservation en cours
    </div>

    <div v-else class="reservations-list">
      <table>
        <thead>
          <tr>
            <th>Catway</th>
            <th>Client</th>
            <th>Bateau</th>
            <th>Date début</th>
            <th>Date fin</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation._id">
            <td>{{ reservation.catwayNumber }}</td>
            <td>{{ reservation.clientName }}</td>
            <td>{{ reservation.boatName }}</td>
            <td>{{ formatDate(reservation.startDate) }}</td>
            <td>{{ formatDate(reservation.endDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { catwaysService } from '../../services/catways.service'

interface Reservation {
  _id: string
  catwayNumber: string
  clientName: string
  boatName: string
  startDate: string
  endDate: string
}

const reservations = ref<Reservation[]>([])
const loading = ref(true)
const error = ref('')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const fetchCurrentReservations = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // Récupérer d'abord tous les catways
    const catwaysResponse = await catwaysService.getAll()
    const catways = catwaysResponse.data.data

    // Pour chaque catway, récupérer ses réservations en cours
    const today = new Date().toISOString()
    const allReservations = await Promise.all(
      catways.map(async (catway) => {
        const response = await catwaysService.getReservations(catway.catwayNumber)
        return response.data.data.filter(res => {
          const startDate = new Date(res.startDate)
          const endDate = new Date(res.endDate)
          const now = new Date()
          return startDate <= now && endDate >= now
        })
      })
    )

    // Aplatir le tableau de réservations
    reservations.value = allReservations.flat()
  } catch (err: any) {
    error.value = 'Erreur lors du chargement des réservations'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCurrentReservations()
})
</script>

<style scoped>
.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

tr:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
  }
}
</style> 