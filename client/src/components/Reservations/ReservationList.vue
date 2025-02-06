<template>
  <div class="reservation-list">
    <div class="header">
      <h2>Liste des Réservations</h2>
      <button @click="showAddForm = true" class="btn-primary">
        <i class="fas fa-plus"></i> Nouvelle Réservation
      </button>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>N° Catway</th>
          <th>Client</th>
          <th>Bateau</th>
          <th>Début</th>
          <th>Fin</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in reservations" :key="reservation._id">
          <td>{{ reservation.catwayNumber }}</td>
          <td>{{ reservation.clientName }}</td>
          <td>{{ reservation.boatName }}</td>
          <td>{{ formatDate(reservation.startDate) }}</td>
          <td>{{ formatDate(reservation.endDate) }}</td>
          <td>{{ reservation.status || 'En attente' }}</td>
          <td class="actions">
            <button @click="editReservation(reservation)" class="btn-icon">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(reservation)" class="btn-icon delete">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        <tr v-if="reservations.length === 0">
          <td colspan="7" class="text-center">Aucune réservation trouvée</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal pour ajouter/éditer -->
    <div v-if="showAddForm || editingReservation" class="modal">
      <div class="modal-content">
        <h3>{{ editingReservation ? 'Modifier' : 'Ajouter' }} une réservation</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="catwayId">Catway</label>
            <select
              id="catwayId"
              v-model="formData.catwayId"
              required
            >
              <option v-for="catway in catways" :key="catway._id" :value="catway.catwayNumber">
                N°{{ catway.catwayNumber }} ({{ catway.catwayType }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="clientName">Nom du client</label>
            <input
              type="text"
              id="clientName"
              v-model="formData.clientName"
              required
            >
          </div>

          <div class="form-group">
            <label for="boatName">Nom du bateau</label>
            <input
              type="text"
              id="boatName"
              v-model="formData.boatName"
              required
            >
          </div>

          <div class="form-group">
            <label for="startDate">Date de début</label>
            <input
              type="date"
              id="startDate"
              v-model="formData.startDate"
              required
            >
          </div>

          <div class="form-group">
            <label for="endDate">Date de fin</label>
            <input
              type="date"
              id="endDate"
              v-model="formData.endDate"
              required
              :min="formData.startDate"
            >
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-primary">
              {{ editingReservation ? 'Modifier' : 'Ajouter' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
    getReservations, 
    createReservation, 
    updateReservation, 
    deleteReservation, 
    getCatways, 
    getReservationsByCatway,
    getCurrentReservations 
} from '@/services/api'
import type { Reservation, ReservationFormData, Catway } from '@/types/api'
import { useRoute } from 'vue-router'

const route = useRoute()
const reservations = ref<Reservation[]>([])
const catways = ref<Catway[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showAddForm = ref(false)
const editingReservation = ref<Reservation | null>(null)
const formData = ref<ReservationFormData>({
  catwayId: '',
  clientName: '',
  boatName: '',
  startDate: '',
  endDate: ''
})

const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Charger d'abord les catways pour avoir les références
    const catwaysRes = await getCatways()
    if (catwaysRes.data.success) {
      catways.value = catwaysRes.data.data
    }

    // Si on est sur un catway spécifique
    if (route.params.id) {
      const reservationsRes = await getReservationsByCatway(route.params.id as string)
      if (reservationsRes.data.success) {
        reservations.value = reservationsRes.data.data
      }
    } else {
      // Sinon charger toutes les réservations
      const reservationsRes = await getReservations()
      if (reservationsRes.data.success) {
        reservations.value = reservationsRes.data.data
      }
    }
  } catch (err) {
    console.error('Erreur lors du chargement des réservations:', err)
    error.value = "Erreur lors du chargement des réservations"
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log("Données du formulaire à envoyer:", formData.value);

    if (editingReservation.value) {
      const response = await updateReservation({
        ...formData.value,
        _id: editingReservation.value._id
      });
      console.log("Réponse mise à jour:", response);
    } else {
      const response = await createReservation(formData.value);
      console.log("Réponse création:", response);
    }

    closeModal();
    await loadData();
  } catch (err) {
    console.error("Erreur lors de la sauvegarde:", err);
    error.value = err.response?.data?.error || "Erreur lors de la sauvegarde de la réservation";
  } finally {
    loading.value = false;
  }
}

const editReservation = (reservation: Reservation) => {
  editingReservation.value = reservation
  formData.value = {
    catwayId: reservation.catwayNumber,
    clientName: reservation.clientName,
    boatName: reservation.boatName,
    startDate: reservation.startDate.split('T')[0],
    endDate: reservation.endDate.split('T')[0]
  }
  showAddForm.value = true
}

const confirmDelete = async (reservation: Reservation) => {
  if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
    try {
      await deleteReservation(reservation.catwayNumber, reservation._id)
      await loadData()
    } catch (err) {
      error.value = "Erreur lors de la suppression"
    }
  }
}

const closeModal = () => {
  showAddForm.value = false
  editingReservation.value = null
  formData.value = {
    catwayId: '',
    clientName: '',
    boatName: '',
    startDate: '',
    endDate: ''
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const loadReservations = async () => {
    try {
        console.log("Chargement des réservations...");
        const response = await getReservations();
        console.log("Réservations chargées:", response.data);
        reservations.value = response.data.data;
    } catch (error) {
        console.error("Erreur lors du chargement des réservations:", error);
    }
};

// Après la création d'une réservation
const onReservationCreated = async () => {
    console.log("Rechargement des réservations après création");
    await loadReservations();
};

onMounted(loadData)
</script>

<style scoped>
.reservation-list {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-icon.delete {
  background-color: #dc3545;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style> 