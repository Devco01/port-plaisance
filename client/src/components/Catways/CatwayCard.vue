<template>
  <div class="catway-card">
    <div class="card-header">
      <h3>Catway {{ catway.catwayNumber }}</h3>
      <span class="status" :class="catway.catwayState === 'bon état' ? 'good' : 'warning'">
        {{ catway.catwayState }}
      </span>
    </div>
    
    <div class="catway-info">
      <p>
        <i class="fas fa-ruler-combined"></i>
        Type: {{ catway.catwayType === 'long' ? 'Long (12m)' : 'Court (8m)' }}
      </p>
      <div class="dimensions">
        <span><i class="fas fa-arrows-alt-h"></i> Longueur: {{ catway.catwayType === 'long' ? '12m' : '8m' }}</span>
        <span><i class="fas fa-arrows-alt-v"></i> Largeur: {{ catway.catwayType === 'long' ? '4m' : '3m' }}</span>
      </div>
    </div>

    <button @click="$emit('reservations')" class="btn-reservations">
      <i class="fas fa-calendar-alt"></i>
      Voir les réservations
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
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.catway-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h3 {
  margin: 0;
  color: #2c3e50;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.status.good {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status.warning {
  background-color: #fff3e0;
  color: #ef6c00;
}

.catway-info {
  margin: 1rem 0;
}

.dimensions {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.btn-reservations {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.btn-reservations:hover {
  background-color: #2980b9;
}

i {
  margin-right: 0.5rem;
}
</style> 