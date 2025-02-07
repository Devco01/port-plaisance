<template>
  <div class="catway-card">
    <h3>Catway {{ catway.catwayNumber }}</h3>
    <div class="catway-info">
      <p>Type: {{ catway.catwayType }}</p>
      <p>État: {{ catway.catwayState }}</p>
    </div>
    <button @click="$emit('reservations')" class="btn-reservations">
      Réservations
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  catway: {
    catwayNumber: number;
    catwayType: 'long' | 'short';
    catwayState: string;
  }
}>();
</script> 