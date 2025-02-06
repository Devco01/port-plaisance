<template>
  <PageLayout title="Gestion des Catways">
    <template #header-actions>
      <button @click="showAddForm = true" class="btn-action btn-primary">
        <i class="fas fa-plus"></i> Nouveau Catway
      </button>
    </template>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Chargement...
    </div>
    
    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
    </div>
    
    <div v-else class="catways-grid">
      <div v-for="catway in catways" 
           :key="catway.catwayNumber" 
           class="catway-card">
        <div class="catway-header">
          <span class="catway-number">Catway {{ catway.catwayNumber }}</span>
          <span :class="['type-badge', `type-${catway.catwayType}`]">
            {{ catway.catwayType }}
          </span>
        </div>
        <div class="catway-body">
          <p class="state">{{ catway.catwayState }}</p>
          <div class="actions">
            <button @click="editCatway(catway)" class="btn-action btn-edit">
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button @click="confirmDelete(catway)" class="btn-action btn-delete">
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter/éditer -->
    <Modal v-if="showModal" @close="closeModal">
      <template #header>
        <h3>{{ isEditing ? 'Modifier' : 'Ajouter' }} un catway</h3>
      </template>
      
      <template #body>
        <CatwayForm 
          :catway="selectedCatway"
          @submit="handleSubmit"
          @cancel="closeModal"
        />
      </template>
    </Modal>
  </PageLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CatwayList from '@/components/Catways/CatwayList.vue'
import PageLayout from '@/components/common/PageLayout.vue'
import Modal from '@/components/common/Modal.vue'
import CatwayForm from '@/components/Catways/CatwayForm.vue'

export default defineComponent({
  name: 'CatwaysView',
  components: {
    CatwayList,
    PageLayout,
    Modal,
    CatwayForm
  },
  data() {
    return {
      loading: true,
      error: null,
      catways: [],
      showAddForm: false,
      showModal: false,
      isEditing: false,
      selectedCatway: null
    }
  },
  methods: {
    async fetchCatways() {
      try {
        const response = await fetch('/api/catways')
        if (response.ok) {
          const data = await response.json()
          this.catways = data
        } else {
          throw new Error('Erreur lors de la récupération des catways')
        }
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    editCatway(catway) {
      this.isEditing = true
      this.selectedCatway = { ...catway }
      this.showModal = true
    },
    deleteCatway(catway) {
      // Implement the delete logic here
    },
    handleSubmit(catway) {
      // Implement the submit logic here
    },
    closeModal() {
      this.showModal = false
      this.selectedCatway = null
    }
  },
  mounted() {
    this.fetchCatways()
  }
})
</script>

<style scoped>
.catways-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.catway-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.catway-header {
  background: var(--primary-dark);
  color: white;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.type-long { 
  background-color: var(--success-color);
  color: white;
}

.type-short { 
  background-color: var(--warning-color);
  color: white;
}

.catway-body {
  padding: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.state {
  color: var(--gray-600);
  margin: 0.5rem 0;
}

/* ... autres styles ... */
</style> 