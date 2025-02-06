<template>
  <PageLayout title="Gestion des Réservations">
    <template #header-actions>
      <button @click="showAddForm = true" class="btn-action btn-primary">
        <i class="fas fa-plus"></i> Nouvelle Réservation
      </button>
    </template>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Chargement...
    </div>
    
    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </div>
    
    <div v-else class="reservations-grid">
      <div v-for="reservation in reservations" 
           :key="reservation._id" 
           class="reservation-card">
        <div class="reservation-header">
          <span class="catway-number">Catway {{ reservation.catwayNumber }}</span>
          <span :class="['status-badge', `status-${reservation.status || 'pending'}`]">
            {{ getStatusLabel(reservation.status) }}
          </span>
        </div>
        <div class="reservation-body">
          <p class="client-info">
            <i class="fas fa-user"></i> {{ reservation.clientName }}
          </p>
          <p class="boat-info">
            <i class="fas fa-ship"></i> {{ reservation.boatName }}
          </p>
          <div class="dates">
            <p><i class="fas fa-calendar-alt"></i> Du {{ formatDate(reservation.startDate) }}</p>
            <p><i class="fas fa-calendar-alt"></i> Au {{ formatDate(reservation.endDate) }}</p>
          </div>
          <div class="actions">
            <button @click="editReservation(reservation)" class="btn-action btn-edit">
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button @click="confirmDelete(reservation)" class="btn-action btn-delete">
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="showModal" @close="closeModal">
      <template #header>
        <h3>{{ isEditing ? 'Modifier' : 'Créer' }} une réservation</h3>
      </template>
      <template #body>
        <ReservationForm 
          :reservation="selectedReservation"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </template>
    </Modal>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReservationList from '@/components/Reservations/ReservationList.vue'
import PageLayout from '@/components/PageLayout.vue'
import Modal from '@/components/Modal.vue'
import ReservationForm from '@/components/Reservations/ReservationForm.vue'

export default defineComponent({
  name: 'ReservationsView',
  components: {
    ReservationList,
    PageLayout,
    Modal,
    ReservationForm
  },
  data() {
    return {
      showAddForm: false,
      loading: true,
      error: null,
      reservations: [],
      showModal: false,
      isEditing: false,
      selectedReservation: null
    }
  },
  methods: {
    getStatusLabel(status) {
      switch (status) {
        case 'pending':
          return 'En attente'
        case 'confirmed':
          return 'Confirmée'
        case 'cancelled':
          return 'Annulée'
        default:
          return 'État inconnu'
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    editReservation(reservation) {
      this.selectedReservation = { ...reservation }
      this.isEditing = true
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedReservation = null
      this.isEditing = false
    },
    handleSubmit(reservation) {
      // Handle form submission
      this.closeModal()
    },
    confirmDelete(reservation) {
      // Handle delete confirmation
    }
  },
  mounted() {
    // Fetch reservations
  }
})
</script>

<style scoped>
.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.reservation-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.reservation-header {
  background: var(--primary-dark);
  color: white;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pending { background-color: var(--warning-color); }
.status-confirmed { background-color: var(--success-color); }
.status-cancelled { background-color: var(--danger-color); }

.reservation-body {
  padding: 1rem;
}

.client-info, .boat-info {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-700);
}

.dates {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
}

.dates p {
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-600);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
}
</style> 