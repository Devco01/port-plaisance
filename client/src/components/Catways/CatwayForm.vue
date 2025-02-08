<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ isEditing ? 'Modifier le catway' : 'Nouveau catway' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="catwayNumber">Numéro du catway</label>
          <select
            id="catwayNumber"
            v-model="formData.catwayNumber"
            required
            :disabled="isEditing"
          >
            <option value="">Sélectionner un numéro</option>
            <option 
              v-for="number in availableNumbers" 
              :key="number" 
              :value="number"
            >
              {{ number }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="catwayType">Type de catway</label>
          <select
            id="catwayType"
            v-model="formData.catwayType"
            required
          >
            <option value="long">Long</option>
            <option value="short">Court</option>
          </select>
        </div>

        <div class="form-group">
          <label for="catwayState">État</label>
          <textarea
            id="catwayState"
            v-model="formData.catwayState"
            rows="3"
            placeholder="Description de l'état du catway"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeModal">
            Annuler
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import catwaysService from '@/services/catways.service'

const props = defineProps<{
  catway?: {
    catwayNumber: string
    catwayType: string
    catwayState: string
  }
}>()

const emit = defineEmits(['close', 'created', 'updated'])

const isEditing = computed(() => !!props.catway)
const loading = ref(false)
const error = ref('')

const formData = ref({
  catwayNumber: '',
  catwayType: 'long' as 'long' | 'short',
  catwayState: ''
})

const availableNumbers = ref<number[]>([])

const closeModal = () => {
  emit('close')
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (isEditing.value && props.catway) {
      // En édition, on ne peut modifier que l'état selon le cahier des charges
      await catwaysService.update(props.catway.catwayNumber, formData.value.catwayState)
      emit('updated')
    } else {
      await catwaysService.create(formData.value)
      emit('created')
    }
    
    closeModal()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const response = await catwaysService.getAll()
    if (response.success) {
      // Créer un tableau de 1 à 20 (ou autre nombre max de catways)
      const allNumbers = Array.from({length: 20}, (_, i) => i + 1)
      // Filtrer les numéros déjà utilisés
      const usedNumbers = response.data.map((c: any) => parseInt(c.catwayNumber))
      availableNumbers.value = allNumbers.filter(n => !usedNumbers.includes(n))
    }
  } catch (error) {
    console.error('Erreur lors du chargement des numéros:', error)
  }
})

// Initialisation en mode édition
if (props.catway) {
  formData.value = { ...props.catway }
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

input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
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
