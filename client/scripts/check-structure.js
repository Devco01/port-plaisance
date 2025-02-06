const fs = require('fs');
const path = require('path');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

const ensureFile = (file, content) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
    console.log(`Created file: ${file}`);
  }
};

// Vérifier la structure
const componentsPath = path.join(__dirname, '..', 'src', 'components');
const layoutPath = path.join(componentsPath, 'Layout');

ensureDir(layoutPath);
ensureFile(
  path.join(layoutPath, 'PageLayout.vue'),
  `<template>
  <div class="page-layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
// Composant de mise en page
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
}
</style>
`
); 