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