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

// Copier PageLayout.vue s'il n'existe pas
const layoutPath = path.join(__dirname, 'src/components/Layout/PageLayout.vue');
if (!fs.existsSync(layoutPath)) {
  fs.copyFileSync(
    path.join(__dirname, 'src/components/Layout/PageLayout.vue.template'),
    layoutPath
  );
  console.log(`Copied PageLayout.vue to ${layoutPath}`);
} 