<template>
  <div class="reservation-form">
    <h2>{{ isEdit ? 'Modifier' : 'Créer' }} une Réservation</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Catway</label>
        <select v-model="form.catwayNumber" required>
          <!-- Liste des catways disponibles -->
        </select>
      </div>
      <div>
        <label>Client</label>
        <input v-model="form.clientName" required>
      </div>
      <div>
        <label>Bateau</label>
        <input v-model="form.boatName" required>
      </div>
      <div>
        <label>Date début</label>
        <input type="date" v-model="form.startDate" required>
      </div>
      <div>
        <label>Date fin</label>
        <input type="date" v-model="form.endDate" required>
      </div>
      <button type="submit">{{ isEdit ? 'Modifier' : 'Créer' }}</button>
    </form>
  </div>
</template>
