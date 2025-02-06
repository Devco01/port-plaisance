<template>
  <PageLayout title="Gestion des Réservations">
    <template #header-actions>
      <button @click="showAddForm = true" class="btn-action btn-primary">
        <i class="fas fa-plus"></i> Nouvelle Réservation
      </button>
    </template>

    <ReservationList />
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import ReservationList from '@/components/Reservations/ReservationList.vue'

export default defineComponent({
  name: 'ReservationsView',
  components: {
    PageLayout,
    ReservationList
  }
})
</script>
