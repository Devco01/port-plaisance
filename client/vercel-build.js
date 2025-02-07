const fs = require('fs');
const path = require('path');

// Vérifier que les dossiers existent
const dirs = [
  'src/components/Layout',
  'src/components/Users',
  'src/components/Catways',
  'src/components/Reservations'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
});

// Contenu de Navbar.vue
const navbarContent = `<template>
  <nav class="navbar">
    <router-link to="/" class="nav-link">Accueil</router-link>
    <router-link to="/reservations" class="nav-link">Réservations</router-link>
    <router-link to="/catways" class="nav-link">Catways</router-link>
    <router-link to="/users" class="nav-link">Utilisateurs</router-link>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
}

.nav-link:hover {
  color: #42b983;
}
</style>`;

// Créer Navbar.vue
const navbarPath = path.join(__dirname, 'src/components/Layout/Navbar.vue');
if (!fs.existsSync(navbarPath)) {
  fs.writeFileSync(navbarPath, navbarContent);
  console.log(`Created Navbar.vue at ${navbarPath}`);
}

// Créer PageLayout.vue directement
const layoutPath = path.join(__dirname, 'src/components/Layout/PageLayout.vue');
if (!fs.existsSync(layoutPath)) {
  const content = `<template>
  <div class="page-layout">
    <Navbar />
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 1rem;
}
</style>`;
  fs.writeFileSync(layoutPath, content);
  console.log(`Created PageLayout.vue at ${layoutPath}`);
}

// Contenu de UserList.vue
const userListContent = `<template>
  <div class="users-list">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.email">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  users: Array<{
    username: string
    email: string
    role: string
  }>
}>()
</script>`;

// Contenu de CatwayList.vue
const catwayListContent = `<template>
  <div class="catway-list">
    <div v-for="catway in catways" :key="catway._id" class="catway-card">
      <h3>Catway {{ catway.number }}</h3>
      <p>Longueur: {{ catway.length }}m</p>
      <p>Largeur: {{ catway.width }}m</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  catways: Array<{
    _id: string
    number: number
    length: number
    width: number
  }>
}>()
</script>`;

// Contenu de CurrentReservations.vue
const currentReservationsContent = `<template>
  <div class="reservations-content">
    <table class="reservations-table">
      <thead>
        <tr>
          <th>Catway</th>
          <th>Client</th>
          <th>Bateau</th>
          <th>Début</th>
          <th>Fin</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in reservations" :key="reservation._id">
          <td>{{ reservation.catwayNumber }}</td>
          <td>{{ reservation.clientName }}</td>
          <td>{{ reservation.boatName }}</td>
          <td>{{ formatDate(reservation.startDate) }}</td>
          <td>{{ formatDate(reservation.endDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const reservations = ref([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}
</script>`;

// Contenu de ReservationList.vue
const reservationListContent = `<template>
  <div class="reservation-list">
    <table>
      <thead>
        <tr>
          <th>Catway</th>
          <th>Client</th>
          <th>Dates</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reservation in reservations" :key="reservation._id">
          <td>{{ reservation.catwayNumber }}</td>
          <td>{{ reservation.clientName }}</td>
          <td>{{ formatDate(reservation.startDate) }} - {{ formatDate(reservation.endDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  reservations: Array<{
    _id: string
    catwayNumber: string
    clientName: string
    startDate: string
    endDate: string
  }>
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}
</script>`;

// Contenu de UserForm.vue
const userFormContent = `<template>
  <div class="user-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Nom d'utilisateur</label>
        <input v-model="form.username" type="text" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label>Rôle</label>
        <select v-model="form.role">
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  username: '',
  email: '',
  role: 'user'
})

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>`;

// Contenu de AddCatwayModal.vue
const addCatwayModalContent = `<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Ajouter un catway</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Numéro</label>
          <input v-model="form.number" type="number" required />
        </div>
        <div class="form-group">
          <label>Longueur (m)</label>
          <input v-model="form.length" type="number" step="0.1" required />
        </div>
        <div class="form-group">
          <label>Largeur (m)</label>
          <input v-model="form.width" type="number" step="0.1" required />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  number: 0,
  length: 0,
  width: 0
})

const emit = defineEmits(['submit'])

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>`;

// Créer les fichiers de composants
const files = {
  'Users/UserList.vue': userListContent,
  'Users/UserForm.vue': userFormContent,
  'Catways/CatwayList.vue': catwayListContent,
  'Catways/AddCatwayModal.vue': addCatwayModalContent,
  'Reservations/CurrentReservations.vue': currentReservationsContent,
  'Reservations/ReservationList.vue': reservationListContent
};

Object.entries(files).forEach(([file, content]) => {
  const filePath = path.join(__dirname, 'src/components', file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${file} at ${filePath}`);
  }
}); 