<template>
  <div class="catway-list">
    <div class="header">
      <h2>Liste des Catways</h2>
      <button @click="showAddForm = true" class="btn-primary">
        <i class="fas fa-plus"></i> Nouveau Catway
      </button>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Numéro</th>
          <th>Type</th>
          <th>État</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="catway in catways" :key="catway._id">
          <td>{{ catway.catwayNumber }}</td>
          <td>{{ catway.catwayType === 'long' ? 'Long' : 'Court' }}</td>
          <td>{{ catway.catwayState }}</td>
          <td class="actions">
            <button @click="editCatway(catway)" class="btn-icon">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(catway)" class="btn-icon delete">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal pour ajouter/éditer -->
    <div v-if="showAddForm || editingCatway" class="modal">
      <div class="modal-content">
        <h3>{{ editingCatway ? 'Modifier' : 'Ajouter' }} un catway</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="catwayNumber">Numéro</label>
            <input
              type="number"
              id="catwayNumber"
              v-model.number="formData.catwayNumber"
              :disabled="!!editingCatway"
              required
            >
          </div>

          <div class="form-group">
            <label for="catwayType">Type</label>
            <select
              id="catwayType"
              v-model="formData.catwayType"
              :disabled="!!editingCatway"
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
              required
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-primary">
              {{ editingCatway ? 'Modifier' : 'Ajouter' }}
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

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getCatways, createCatway, updateCatway, deleteCatway } from '@/services/api'
import type { Catway } from '@/types/api'

interface CatwayFormData {
  catwayNumber: number;
  catwayType: 'long' | 'short';
  catwayState: string;
}

export default defineComponent({
  name: 'CatwayList',
  setup() {
    const catways = ref<Catway[]>([])
    const loading = ref(false)
    const error = ref('')
    const showAddForm = ref(false)
    const editingCatway = ref<Catway | null>(null)
    const formData = ref<CatwayFormData>({
      catwayNumber: 0,
      catwayType: 'long',
      catwayState: ''
    })

    const loadCatways = async () => {
      try {
        loading.value = true
        const response = await getCatways()
        catways.value = response.data.data
      } catch (err) {
        error.value = 'Erreur lors du chargement des catways'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      try {
        if (editingCatway.value) {
          await updateCatway(editingCatway.value.catwayNumber, formData.value)
        } else {
          await createCatway(formData.value)
        }
        await loadCatways()
        closeModal()
      } catch (err) {
        error.value = 'Erreur lors de l\'enregistrement'
        console.error(err)
      }
    }

    const editCatway = (catway: Catway) => {
      editingCatway.value = catway
      formData.value = {
        catwayNumber: catway.catwayNumber,
        catwayType: catway.catwayType,
        catwayState: catway.catwayState
      }
    }

    const confirmDelete = async (catway: Catway) => {
      if (confirm(`Voulez-vous vraiment supprimer le catway n°${catway.catwayNumber} ?`)) {
        try {
          await deleteCatway(catway.catwayNumber)
          await loadCatways()
        } catch (err) {
          error.value = 'Erreur lors de la suppression'
          console.error(err)
        }
      }
    }

    const closeModal = () => {
      showAddForm.value = false
      editingCatway.value = null
      formData.value = {
        catwayNumber: 0,
        catwayType: 'long',
        catwayState: ''
      }
    }

    onMounted(loadCatways)

    return {
      catways,
      loading,
      error,
      showAddForm,
      editingCatway,
      formData,
      handleSubmit,
      editCatway,
      confirmDelete,
      closeModal
    }
  }
})
</script>

<style scoped>
.catway-list {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f8f9fa;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #e9ecef;
  color: #495057;
}

.btn-icon.delete {
  color: #dc3545;
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

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}
</style> 