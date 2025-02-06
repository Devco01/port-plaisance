<template>
  <div class="dashboard">
    <div v-if="loading" class="loading-overlay">
      <i class="fas fa-spinner fa-spin"></i> Chargement...
    </div>
    <template v-else>
      <div class="welcome-section">
        <h1>Bienvenue, {{ authStore.username }}</h1>
        <p>{{ authStore.userRole === 'admin' ? 'Administrateur' : 'Utilisateur' }}</p>
      </div>

      <header class="dashboard-header">
        <div class="user-info">
          <span class="username">{{ authStore.username }}</span>
          <span class="email">{{ authStore.user?.email }}</span>
        </div>
        <div class="date">{{ currentDate }}</div>
      </header>

      <main class="main-content">
        <div class="dashboard-section">
          <div class="section-header">
            <h2>Réservations en cours</h2>
            <router-link to="/reservations" class="btn-secondary">
              <i class="fas fa-list"></i> Toutes les réservations
            </router-link>
          </div>

          <div v-if="error" class="error">
            <i class="fas fa-exclamation-triangle"></i> {{ error }}
          </div>
          <div v-else-if="currentReservations.length === 0" class="empty-state">
            <i class="fas fa-calendar-check"></i>
            <p>Aucune réservation en cours</p>
          </div>
          <div v-else class="reservations-grid">
            <div v-for="reservation in currentReservations" 
                 :key="reservation._id" 
                 class="reservation-card">
              <div class="reservation-header">
                <span class="catway-number">Catway {{ reservation.catwayNumber }}</span>
                <span :class="['status', getStatusClass(reservation)]">
                  {{ getStatusLabel(reservation.status) }}
                </span>
              </div>
              <div class="reservation-body">
                <p class="client-name">
                  <i class="fas fa-user"></i> {{ reservation.clientName }}
                </p>
                <p class="boat-name">
                  <i class="fas fa-ship"></i> {{ reservation.boatName }}
                </p>
                <div class="dates">
                  <p>
                    <i class="fas fa-calendar-alt"></i> Du {{ formatDate(reservation.startDate) }}
                  </p>
                  <p>
                    <i class="fas fa-calendar-alt"></i> Au {{ formatDate(reservation.endDate) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { getCurrentReservations } from '@/services/api'
import type { Reservation } from '@/types/api'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const loading = ref(true)
    const error = ref('')
    const currentReservations = ref<Reservation[]>([])

    const currentDate = computed(() => new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }))

    const loadCurrentReservations = async () => {
      try {
        console.log("Chargement des réservations en cours...");
        const response = await getCurrentReservations();
        console.log("Réponse reçue:", response);
        
        if (response.data?.success) {
          currentReservations.value = response.data.data;
          console.log("Réservations en cours chargées:", currentReservations.value);
        } else {
          error.value = 'Erreur: données invalides';
        }
      } catch (err) {
        console.error('Erreur lors du chargement des réservations:', err);
        error.value = 'Erreur lors du chargement des réservations';
      } finally {
        loading.value = false;
      }
    }

    const formatDate = (date: string) => {
      try {
        console.log("Formatage de la date:", date);
        return new Date(date).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (err) {
        console.error("Erreur lors du formatage de la date:", err);
        return date;
      }
    }

    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'confirmed':
          return 'Confirmée';
        case 'pending':
          return 'En attente';
        case 'cancelled':
          return 'Annulée';
        default:
          return status;
      }
    }

    const getStatusClass = (reservation: Reservation) => {
      return `status-${reservation.status || 'pending'}`;
    }

    onMounted(async () => {
      await loadCurrentReservations()
      console.log('User from authStore:', authStore.user)
      console.log('Username:', authStore.username)
      console.log('Role:', authStore.userRole)
    })

    watch(currentReservations, (newVal) => {
      console.log("Les réservations ont changé:", newVal);
    }, { deep: true });

    return {
      currentReservations,
      loading,
      error,
      formatDate,
      getStatusLabel,
      getStatusClass,
      currentDate,
      authStore
    }
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: var(--gray-100);
}

.welcome-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.welcome-section h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #6c757d;
  font-size: 1.1rem;
}

.dashboard-header {
  background-color: var(--secondary-color);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  font-size: 1.1rem;
}

.email {
  font-size: 0.9rem;
  opacity: 0.8;
}

.date {
  font-size: 1.1rem;
}

.main-content {
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.reservation-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.reservation-header {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.catway-number {
  font-weight: bold;
}

.reservation-body {
  padding: 1rem;
}

.client-name, .boat-name {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
}

.status-confirmed { background-color: var(--success-color); }
.status-pending { background-color: var(--warning-color); }
.status-cancelled { background-color: var(--danger-color); }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--secondary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.875rem;
}

.btn-secondary:hover {
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--gray-600);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--gray-400);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
}

.error {
  color: var(--danger-color);
}

.loading i, .error i {
  margin-right: 0.5rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--primary-color);
  z-index: 1000;
}

.loading-overlay i {
  margin-right: 0.5rem;
  font-size: 1.5rem;
}
</style> 