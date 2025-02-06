<template>
  <div class="catway-form">
    <h2>{{ isEdit ? 'Modifier' : 'Créer' }} un Catway</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Numéro</label>
        <input v-model="form.catwayNumber" required>
      </div>
      <div>
        <label>Type</label>
        <select v-model="form.catwayType" required>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
      </div>
      <div>
        <label>État</label>
        <input v-model="form.catwayState" required>
      </div>
      <button type="submit">{{ isEdit ? 'Modifier' : 'Créer' }}</button>
    </form>
  </div>
</template>
# CatwayForm.vue
@"
<template>
  <div class="catway-form">
    <h2>{{ isEdit ? 'Modifier' : 'Créer' }} un Catway</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Numéro</label>
        <input v-model="form.catwayNumber" required>
      </div>
      <div>
        <label>Type</label>
        <select v-model="form.catwayType" required>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
      </div>
      <div>
        <label>État</label>
        <input v-model="form.catwayState" required>
      </div>
      <button type="submit">{{ isEdit ? 'Modifier' : 'Créer' }}</button>
    </form>
  </div>
</template>
