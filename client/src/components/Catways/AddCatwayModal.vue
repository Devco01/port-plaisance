<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Ajouter un catway</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="number">Numéro</label>
          <input 
            type="number" 
            id="number"
            v-model="formData.number"
            required
            min="1"
          />
        </div>

        <div class="form-group">
          <label for="length">Longueur (m)</label>
          <input 
            type="number" 
            id="length"
            v-model="formData.length"
            required
            min="1"
            step="0.1"
          />
        </div>

        <div class="form-group">
          <label for="width">Largeur (m)</label>
          <input 
            type="number" 
            id="width"
            v-model="formData.width"
            required
            min="1"
            step="0.1"
          />
        </div>

        <div class="form-group">
          <label for="status">État</label>
          <select id="status" v-model="formData.status" required>
            <option value="available">Disponible</option>
            <option value="maintenance">En maintenance</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="$emit('close')">
            Annuler
          </button>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Création...' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import catwaysService from '../../services/catways.service'

const emit = defineEmits(['close', 'catway-added'])

const loading = ref(false)
const formData = ref({
  number: '',
  length: '',
  width: '',
  status: 'available'
})

const handleSubmit = async () => {
  try {
    loading.value = true
    const response = await catwaysService.create(formData.value)
    emit('catway-added', response.data)
  } catch (error) {
    console.error('Erreur lors de la création du catway:', error)
    alert('Erreur lors de la création du catway')
  } finally {
    loading.value = false
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
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.submit-btn {
  background-color: #42b983;
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.submit-btn:hover {
  background-color: #3aa876;
}

.submit-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
</style> 