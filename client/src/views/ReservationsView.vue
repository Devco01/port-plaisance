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
              <option v-for="catway in catways" :key="catway.catwayNumber" :value="catway.catwayNumber">
                {{ catway.catwayNumber }}
              </option>
            </select>
          </div>
        </div>

        <ReservationList 
          :reservations="reservations" 
          :loading="loading"
          :error="error"
          @refresh="fetchReservations"
        />
      </div>

      <ReservationForm
        v-if="showAddForm"
        :catways="catways"
        @close="showAddForm = false"
        @created="handleReservationCreated"
      />
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PageLayout } from '@/components/Layout'
import ReservationList from '@/components/Reservations/ReservationList.vue'
import ReservationForm from '@/components/Reservations/ReservationForm.vue'
import catwaysService from '@/services/catways.service'
import reservationsService from '@/services/reservations.service'

const reservations = ref([])
const catways = ref([])
const loading = ref(true)
const error = ref('')
const showAddForm = ref(false)

const filters = ref({
  date: '',
  catwayNumber: ''
})

const fetchCatways = async () => {
  try {
    const response = await catwaysService.getAll()
    catways.value = response.data || []
  } catch (error) {
    console.error('Erreur lors du chargement des catways:', error)
  }
}

const fetchReservations = async () => {
  try {
    loading.value = true
    error.value = ''

    if (filters.value.catwayNumber) {
      const response = await reservationsService.getReservations(filters.value.catwayNumber)
      const allReservations = response.data.data || []
      reservations.value = filters.value.date 
        ? allReservations.filter(res => {
            const filterDate = new Date(filters.value.date)
            const startDate = new Date(res.startDate)
            const endDate = new Date(res.endDate)
            return startDate <= filterDate && endDate >= filterDate
          })
        : allReservations
    } else {
      const response = await reservationsService.getAll()
      const allReservations = response.data.data || []
      reservations.value = filters.value.date
        ? allReservations.filter(res => {
            const filterDate = new Date(filters.value.date)
            const startDate = new Date(res.startDate)
            const endDate = new Date(res.endDate)
            return startDate <= filterDate && endDate >= filterDate
          })
        : allReservations
    }
  } catch (err: any) {
    error.value = 'Erreur lors du chargement des réservations'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const handleReservationCreated = () => {
  showAddForm.value = false
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
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background-color: #3aa876;
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