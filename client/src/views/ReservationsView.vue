<template>
  <PageLayout>
    <div class="reservations">
      <div class="page-header">
        <h1>Gestion des Réservations</h1>
        <div class="actions">
          <button @click="showAddForm = true" class="add-btn">
            <i class="fas fa-plus"></i>
            Nouvelle Réservation
          </button>
        </div>
      </div>

      <div class="content-card">
        <div class="filters">
          <div class="filter-group">
            <label for="dateFilter">Filtrer par date</label>
            <input 
              type="date" 
              id="dateFilter"
              v-model="filters.date"
              @change="applyFilters"
            />
          </div>
          
          <div class="filter-group">
            <label for="catwayFilter">Filtrer par catway</label>
            <select 
              id="catwayFilter"
              v-model="filters.catwayNumber"
              @change="applyFilters"
            >
              <option value="">Tous les catways</option>
              <option v-for="catway in catways" :key="catway.number" :value="catway.number?.toString()">
                {{ catway.number }}
              </option>
            </select>
          </div>
        </div>

        <ReservationList 
          :reservations="reservations" 
          :loading="loading"
          :error="error"
          @refresh="fetchReservations"
          @edit="handleEdit"
        />
      </div>

      <ReservationForm
        v-if="showAddForm"
        :reservation="selectedReservation"
        :catways="catways"
        @close="closeForm"
        @created="handleReservationCreated"
        @updated="handleReservationUpdated"
      />
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { PageLayout } from '@/components/Layout'
import ReservationList from '@/components/Reservations/ReservationList.vue'
import ReservationForm from '@/components/Reservations/ReservationForm.vue'
import catwaysService from '@/services/catways.service'
import type { ErrorHandler } from '@/components/ErrorHandler.vue'
import type { Reservation } from '@/services/catways.service'

// Fonction pour formater les données des réservations
const formatReservationData = (reservations: Array<any>): Reservation[] => {
  if (!Array.isArray(reservations)) {
    console.error('Les réservations ne sont pas un tableau:', reservations);
    return [];
  }
  
  return reservations.map(res => {
    console.log('Formatage réservation:', {
      id: res._id,
      catway: res.catway,
      catwayNumber: res.catway?.catwayNumber,
      rawData: res
    });
    
    if (!res) {
      console.error('Réservation invalide:', res);
      return null;
    }
    
    return {
      _id: res._id,
      catway: {
        number: res.catway?.number?.toString() || res.catway?.catwayNumber?.toString() || 'N/A'
      },
      clientName: res.clientName || 'Non spécifié',
      boatName: res.boatName || 'Non spécifié',
      startDate: res.startDate,
      endDate: res.endDate,
      status: res.status
    }
  }).filter(Boolean)
}

const reservations = ref<Reservation[]>([])
const catways = ref([])
const loading = ref(true)
const errorHandler = inject<ErrorHandler>('errorHandler')
const showAddForm = ref(false)
const error = ref('')
const selectedReservation = ref<Reservation | null>(null)

const filters = ref({
  date: '',
  catwayNumber: ''
})

const fetchCatways = async () => {
  try {
    const response = await catwaysService.getAll()
    console.log('Catways response:', response)  // Temporaire pour déboguer
    catways.value = Array.isArray(response.data) 
      ? response.data.map(catway => ({
          ...catway,
          number: catway.number?.toString() || 'N/A'
        }))
      : []
  } catch (error) {
    console.error('Erreur lors du chargement des catways:', error)
  }
}

const fetchReservations = async () => {
  try {
    if (filters.value.catwayNumber) {
      const response = await catwaysService.getReservations(filters.value.catwayNumber)
      console.log('Response pour un catway spécifique:', response);
      const allReservations = response.data || []
      const filteredReservations = filters.value.date 
        ? allReservations.filter(res => {
            const filterDate = new Date(filters.value.date)
            const startDate = new Date(res.startDate)
            const endDate = new Date(res.endDate)
            return startDate <= filterDate && endDate >= filterDate
          })
        : allReservations
      reservations.value = formatReservationData(filteredReservations)
    } else {
      const response = await catwaysService.getAllReservations()
      console.log('Response pour toutes les réservations:', response);
      const allReservations = response.data || []
      
      const filteredReservations = filters.value.date
        ? allReservations.filter(res => {
            const filterDate = new Date(filters.value.date)
            const startDate = new Date(res.startDate)
            const endDate = new Date(res.endDate)
            return startDate <= filterDate && endDate >= filterDate
          })
        : allReservations
      console.log('Réservations avant formatage:', filteredReservations);
      reservations.value = formatReservationData(filteredReservations)
      console.log('Réservations après formatage:', reservations.value);
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des réservations'
    console.error('Erreur lors du chargement des réservations:', err)
  } finally {
    loading.value = false
  }
}

const handleReservationCreated = () => {
  showAddForm.value = false
  fetchReservations()
}

const handleEdit = (reservation: Reservation): void => {
  selectedReservation.value = reservation
  showAddForm.value = true
}

const closeForm = () => {
  showAddForm.value = false
  selectedReservation.value = null
}

const handleReservationUpdated = () => {
  closeForm()
  fetchReservations()
}

const applyFilters = () => {
  fetchReservations()
}

onMounted(() => {
  fetchCatways()
  fetchReservations()
})
</script>

<style scoped>
.reservations {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.content-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

label {
  color: #666;
  font-size: 0.9rem;
}

input, select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .reservations {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .content-card {
    padding: 1rem;
  }
  
  .filters {
    flex-direction: column;
  }
}
</style> 