<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ isEditing ? 'Modifier la réservation' : 'Nouvelle réservation' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="catwayId">Catway</label>
          <select
            id="catwayId"
            v-model="formData.catwayId"
            required
          >
            <option value="">Sélectionnez un catway</option>
            <option 
              v-for="catway in availableCatways" 
              :key="catway._id" 
              :value="catway._id"
            >
              {{ catway.catwayNumber }} ({{ catway.catwayType }})
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
            placeholder="Nom du client"
          />
        </div>

        <div class="form-group">
          <label for="boatName">Nom du bateau</label>
          <input
            type="text"
            id="boatName"
            v-model="formData.boatName"
            required
            placeholder="Nom du bateau"
          />
        </div>

        <div class="form-group">
          <label for="startDate">Date de début</label>
          <input
            type="date"
            id="startDate"
            v-model="formData.startDate"
            required
            :min="today"
            @change="validateDates"
          />
        </div>

        <div class="form-group">
          <label for="endDate">Date de fin</label>
          <input
            type="date"
            id="endDate"
            v-model="formData.endDate"
            required
            :min="formData.startDate || today"
            @change="validateDates"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeModal">
            Annuler
          </button>
          <button type="submit" class="submit-btn" :disabled="loading || !isValid">
            {{ loading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import api from '../../services/api.service'
import catwaysService from '../../services/catways.service'
import reservationsService from '../../services/reservations.service'

const props = defineProps<{
  catways: Array<{
    _id: string
    catwayNumber: string
    catwayType: string
  }>
  reservation?: {
    _id: string
    catwayId: string
    clientName: string
    boatName: string
    startDate: string
    endDate: string
  }
}>()

const emit = defineEmits(['close', 'created', 'updated'])

const isEditing = computed(() => !!props.reservation)
const loading = ref(false)
const error = ref('')

const formData = ref({
  catwayId: '',
  clientName: '',
  boatName: '',
  startDate: '',
  endDate: ''
})

const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const isValid = computed(() => {
  return (
    formData.value.catwayId &&
    formData.value.clientName &&
    formData.value.boatName &&
    formData.value.startDate &&
    formData.value.endDate &&
    new Date(formData.value.startDate) <= new Date(formData.value.endDate)
  )
})

const availableCatways = computed(() => {
  return props.catways.filter(catway => {
    // TODO: Ajouter la logique pour filtrer les catways déjà réservés
    return true
  })
})

const validateDates = () => {
  if (formData.value.startDate && formData.value.endDate) {
    const start = new Date(formData.value.startDate)
    const end = new Date(formData.value.endDate)
    
    if (end < start) {
      error.value = 'La date de fin doit être postérieure à la date de début'
      formData.value.endDate = formData.value.startDate
    } else {
      error.value = ''
    }
  }
}

const closeModal = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!isValid.value) return
  
  try {
    loading.value = true
    error.value = ''
    
    if (isEditing.value && props.reservation) {
      await catwaysService.updateReservation(
        props.reservation.catwayNumber,
        props.reservation._id,
        formData.value
      )
      emit('updated')
    } else {
      await catwaysService.createReservation(
        formData.value.catwayId,
        formData.value
      )
      emit('created')
    }
    
    closeModal()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

// Initialisation du formulaire en mode édition
if (props.reservation) {
  formData.value = {
    catwayId: props.reservation.catwayId,
    clientName: props.reservation.clientName,
    boatName: props.reservation.boatName,
    startDate: props.reservation.startDate.split('T')[0],
    endDate: props.reservation.endDate.split('T')[0]
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.submit-btn {
  background-color: #42b983;
  color: white;
}

.submit-btn:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}
</style>
