<template>
  <div class="user-form">
    <h2>{{ isEdit ? 'Modifier' : 'Créer' }} un Utilisateur</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>Email</label>
        <input type="email" v-model="form.email" required>
      </div>
      <div>
        <label>Nom d'utilisateur</label>
        <input v-model="form.username" required>
      </div>
      <div>
        <label>Mot de passe</label>
        <input type="password" v-model="form.password" :required="!isEdit">
      </div>
      <button type="submit">{{ isEdit ? 'Modifier' : 'Créer' }}</button>
    </form>
  </div>
</template>
