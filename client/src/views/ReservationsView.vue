<template>
  <PageLayout>
    <div class="reservations">
      <div class="page-header">
        <h1>Gestion des Réservations</h1>
      </div>

      <div class="content-card">
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
  if (!Array.isArray(reservations)) return [];

  const formatted = reservations.map(res => {
    if (!res || typeof res.catwayNumber === 'undefined') return null;

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
      return null;
    }
  }).filter(Boolean);

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

const fetchCatways = async () => {
  try {
    const response = await catwaysService.getAll()
    catways.value = Array.isArray(response.data) 
      ? response.data.map(catway => ({
          ...catway,
          number: catway.catwayNumber.toString()
        }))
      : []
  } catch (error) {
    console.error('Erreur lors du chargement des catways:', error)
  }
}

const fetchReservations = async () => {
  try {
    const response = await catwaysService.getAllReservations()
    const allReservations = response.data || []
    reservations.value = formatReservationData(allReservations)
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des réservations'
  } finally {
    loading.value = false
  }
}

const handleReservationCreated = () => {
  showAddForm.value = false
  fetchReservations()
}

const handleEdit = (reservation: any) => {
  // S'assurer que la structure de la réservation est correcte
  selectedReservation.value = {
    _id: reservation._id,
    catwayNumber: reservation.catwayNumber.toString(),
    clientName: reservation.clientName,
    boatName: reservation.boatName,
    startDate: new Date(reservation.startDate).toISOString().split('T')[0],
    endDate: new Date(reservation.endDate).toISOString().split('T')[0]
  }
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
}

.add-button-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}
</style> 