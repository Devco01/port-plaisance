<template>
  <div class="catway-form">
    <h3>{{ isEdit ? 'Modifier' : 'Ajouter' }} un Catway</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="catwayNumber">Numéro :</label>
        <input 
          type="number" 
          id="catwayNumber" 
          v-model="form.catwayNumber"
          :disabled="isEdit"
          required
        >
      </div>

      <div class="form-group">
        <label for="catwayType">Type :</label>
        <select 
          id="catwayType" 
          v-model="form.catwayType"
          :disabled="isEdit"
          required
        >
          <option value="long">Long</option>
          <option value="short">Court</option>
        </select>
      </div>

      <div class="form-group">
        <label for="catwayState">État :</label>
        <textarea 
          id="catwayState" 
          v-model="form.catwayState"
          required
        ></textarea>
      </div>

      <div class="form-actions">
        <button type="submit">{{ isEdit ? 'Modifier' : 'Ajouter' }}</button>
        <button type="button" @click="$emit('cancel')">Annuler</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { createCatway, updateCatway } from '@/services/api'

export default {
  name: 'CatwayForm',
  props: {
    catway: {
      type: Object,
      default: () => ({
        catwayNumber: '',
        catwayType: 'long',
        catwayState: ''
      })
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({ ...props.catway })

    const handleSubmit = async () => {
      try {
        if (props.isEdit) {
          await updateCatway(form.value.catwayNumber, form.value)
        } else {
          await createCatway(form.value)
        }
        emit('submit')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
      }
    }

    onMounted(() => {
      form.value = { ...props.catway }
    })

    return {
      form,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.catway-form {
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

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  height: 100px;
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