<template>
  <PageLayout>
    <div class="reservations">
      <div class="page-header">
        <h1>Gestion des Réservations</h1>
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
              <option 
                v-for="catway in catways" 
                :key="catway.catwayNumber" 
                :value="catway.catwayNumber"
              >
                {{ catway.catwayNumber }}
              </option>
            </select>
          </div>
        </div>

        <div class="add-button-container">
          <button @click="showAddForm = true" class="btn-action btn-add">
            <i class="fas fa-plus"></i>
            Nouvelle Réservation
          </button>
        </div>

        <ReservationList 
          :reservations="reservations" 
          :loading="loading"
          :error="error"
          @refresh="fetchReservations"
          @edit-reservation="handleEdit"
          @delete-reservation="handleDelete"
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

      <ConfirmDialog
        v-if="showDeleteConfirm"
        title="Supprimer la réservation"
        message="Êtes-vous sûr de vouloir supprimer cette réservation ?"
        @confirm="confirmDelete"
        @cancel="showDeleteConfirm = false"
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
import ConfirmDialog from '@/components/Common/ConfirmDialog.vue'

// Fonction pour formater les données des réservations
const formatReservationData = (reservations: Array<any>): Reservation[] => {
  console.log('=== DÉBUT FORMATAGE RÉSERVATIONS ===');
  console.log('Données brutes:', reservations);

  if (!Array.isArray(reservations)) {
    console.error('Les réservations ne sont pas un tableau:', reservations);
    return [];
  }

  const formatted = reservations.map(res => {
    if (!res || typeof res.catwayNumber === 'undefined') {
      console.error('Réservation invalide:', res);
      return null;
    }

    try {
      return {
        _id: res._id,
        catwayNumber: parseInt(res.catwayNumber.toString()),
        clientName: res.clientName || 'Non spécifié',
        boatName: res.boatName || 'Non spécifié',
        startDate: new Date(res.startDate),
        endDate: new Date(res.endDate)
      };
    } catch (error) {
      console.error('Erreur lors du formatage:', error);
      return null;
    }
  }).filter(Boolean);

  console.log('Réservations formatées:', formatted);
  return formatted;
}

const reservations = ref<Reservation[]>([])
const catways = ref([])
const loading = ref(true)
const errorHandler = inject<ErrorHandler>('errorHandler')
const showAddForm = ref(false)
const error = ref('')
const selectedReservation = ref<Reservation | null>(null)
const showDeleteConfirm = ref(false)
const reservationToDelete = ref(null)

const filters = ref({
  date: '',
  catwayNumber: ''
})

const fetchCatways = async () => {
  try {
    const response = await catwaysService.getAll()
    console.log('=== CATWAYS LOGS ===');
    console.log('Réponse brute du serveur:', response)
    console.log('Données des catways:', response.data)
    console.log('Premier catway:', response.data[0])
    console.log('==================');

    catways.value = Array.isArray(response.data) 
      ? response.data.map(catway => {
        console.log('Traitement du catway:', catway)
        return {
          ...catway,
          number: catway.catwayNumber.toString()
        }
      })
      : []
    console.log('=== RÉSULTAT FINAL CATWAYS ===');
    console.log('Nombre de catways:', catways.value.length)
    console.log('Structure d\'un catway:', catways.value[0])
    console.log('============================');
  } catch (error) {
    console.error('Erreur lors du chargement des catways:', error)
  }
}

const fetchReservations = async () => {
  try {
    console.log('=== DEBUG fetchReservations ===');
    if (filters.value.catwayNumber) {
      const response = await catwaysService.getReservations(filters.value.catwayNumber)
      console.log('Réponse pour catway spécifique:', response);
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
      console.log('Réponse getAllReservations:', response);
      const allReservations = response.data || []
      console.log('Structure d\'une réservation:', 
        allReservations[0] ? JSON.stringify(allReservations[0], null, 2) : 'Aucune réservation'
      );
      
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
    console.error('Erreur complète:', err);
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

const handleDelete = (reservation: Reservation) => {
  reservationToDelete.value = reservation
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!reservationToDelete.value) return
  
  try {
    await catwaysService.deleteReservation(
      reservationToDelete.value.catwayNumber,
      reservationToDelete.value._id
    )
    fetchReservations()
  } catch (err: any) {
    error.value = err.message
  } finally {
    showDeleteConfirm.value = false
    reservationToDelete.value = null
  }
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

.btn-action {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: white;
  text-transform: uppercase;
  font-weight: 500;
  background-color: #3498db;
}

.btn-action:hover {
  background-color: #2980b9;
}

.btn-add {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
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

.add-button-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style> 