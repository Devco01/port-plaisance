<template>
  <div class="catway-card">
    <h3>Catway {{ catway.catwayNumber }}</h3>
    <div class="catway-info">
      <p>Type: {{ catway.catwayType === 'long' ? 'Long (12m)' : 'Court (8m)' }}</p>
      <p>État: {{ catway.catwayState }}</p>
      <p class="dimensions">
        <span>Longueur: {{ catway.catwayType === 'long' ? '12m' : '8m' }}</span>
        <span>Largeur: {{ catway.catwayType === 'long' ? '4m' : '3m' }}</span>
      </p>
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

<style scoped>
.catway-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.catway-info {
  margin: 1rem 0;
}

.dimensions {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}
</style> 