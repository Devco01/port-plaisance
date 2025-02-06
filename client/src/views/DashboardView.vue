<template>
  <PageLayout>
    <div class="dashboard">
      <!-- En-tête avec les informations utilisateur et la date -->
      <div class="dashboard-header">
        <div class="user-section">
          <h2>Informations utilisateur</h2>
          <div class="user-details">
            <p><strong>Nom :</strong> {{ userData.username }}</p>
            <p><strong>Email :</strong> {{ userData.email }}</p>
          </div>
        </div>
        <div class="date-section">
          <h2>Date du jour</h2>
          <p>{{ formattedDate }}</p>
        </div>
      </div>

      <!-- Section des réservations -->
      <div class="reservations-section">
        <h2>Réservations en cours</h2>
        <CurrentReservations />
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageLayout from '../components/layout/PageLayout.vue'
import CurrentReservations from '@/components/Reservations/CurrentReservations.vue'

// État pour les données utilisateur
const userData = ref({
  username: '',
  email: ''
})

// Formatage de la date
const formattedDate = ref('')

onMounted(() => {
  // Récupération des données utilisateur du localStorage
  const userStr = localStorage.getItem('user')
  if (userStr) {
    userData.value = JSON.parse(userStr)
  }

  // Formatage de la date du jour
  const date = new Date()
  formattedDate.value = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}

.dashboard-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.user-section, .date-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-details p {
  margin: 0;
  color: #666;
}

.user-details strong {
  color: #2c3e50;
}

.date-section p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.reservations-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .dashboard-header {
    grid-template-columns: 1fr;
  }
}
</style> 