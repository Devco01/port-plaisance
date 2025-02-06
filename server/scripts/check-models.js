const fs = require('fs');
const path = require('path');

console.log('=== Vérification des modèles ===');
const modelsDir = path.join(__dirname, '..', 'models');
console.log('Dossier modèles:', modelsDir);
console.log('Contenu du dossier:');
fs.readdirSync(modelsDir).forEach(file => {
    console.log('-', file);
}); 