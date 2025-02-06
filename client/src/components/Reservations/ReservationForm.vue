<template>
  <div class="reservation-form">
    <h3>{{ isEdit ? 'Modifier' : 'Ajouter' }} une Réservation</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="catwayNumber">Numéro de Catway :</label>
        <select 
          id="catwayNumber" 
          v-model="form.catwayNumber"
          required
        >
          <option v-for="catway in catways" :key="catway.catwayNumber" :value="catway.catwayNumber">
            {{ catway.catwayNumber }} ({{ catway.catwayType }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="clientName">Nom du Client :</label>
        <input 
          type="text" 
          id="clientName" 
          v-model="form.clientName"
          required
        >
      </div>

      <div class="form-group">
        <label for="boatName">Nom du Bateau :</label>
        <input 
          type="text" 
          id="boatName" 
          v-model="form.boatName"
          required
        >
      </div>

      <div class="form-group">
        <label for="startDate">Date de début :</label>
        <input 
          type="date" 
          id="startDate" 
          v-model="form.startDate"
          required
        >
      </div>

      <div class="form-group">
        <label for="endDate">Date de fin :</label>
        <input 
          type="date" 
          id="endDate" 
          v-model="form.endDate"
          required
        >
      </div>

      <div class="error" v-if="error">{{ error }}</div>

      <div class="form-actions">
        <button type="submit">{{ isEdit ? 'Modifier' : 'Ajouter' }}</button>
        <button type="button" @click="$emit('cancel')">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { createReservation, updateReservation, getCatways } from '@/services/api'

export default {
  name: 'ReservationForm',
  props: {
    reservation: {
      type: Object,
      default: () => ({
        catwayNumber: '',
        clientName: '',
        boatName: '',
        startDate: '',
        endDate: ''
      })
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({ ...props.reservation })
    const catways = ref([])
    const error = ref('')

    const formatDate = (date) => {
      return new Date(date).toISOString().split('T')[0]
    }

    const handleSubmit = async () => {
      try {
        if (new Date(form.value.startDate) >= new Date(form.value.endDate)) {
          error.value = 'La date de fin doit être postérieure à la date de début'
          return
        }

        if (props.isEdit) {
          await updateReservation(form.value.catwayNumber, form.value)
        } else {
          await createReservation(form.value)
        }
        emit('submit')
      } catch (err) {
        error.value = 'Erreur lors de la sauvegarde'
      }
    }

    const loadCatways = async () => {
      try {
        const data = await getCatways()
        catways.value = data
      } catch (err) {
        error.value = 'Erreur lors du chargement des catways'
      }
    }

    onMounted(() => {
      loadCatways()
      if (props.reservation.startDate) {
        form.value.startDate = formatDate(props.reservation.startDate)
      }
      if (props.reservation.endDate) {
        form.value.endDate = formatDate(props.reservation.endDate)
      }
    })

    return {
      form,
      catways,
      error,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.reservation-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  color: red;
  margin: 10px 0;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button:hover {
  opacity: 0.8;
}
</style> 