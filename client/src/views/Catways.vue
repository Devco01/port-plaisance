<template>
  <PageLayout title="Gestion des Catways">
    <template #header-actions>
      <button @click="showAddForm = true" class="btn-action btn-primary">
        <i class="fas fa-plus"></i> Nouveau Catway
      </button>
    </template>

    <CatwayList />
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import CatwayList from '@/components/Catways/CatwayList.vue'

export default defineComponent({
  name: 'CatwaysView',
  components: {
    PageLayout,
    CatwayList
  }
})
</script>
