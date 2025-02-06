const fs = require('fs');
const path = require('path');

console.log('=== Vérification des modèles ===');
const modelsDir = path.join(__dirname, '..', 'models');
console.log('Dossier modèles:', modelsDir);
console.log('Contenu du dossier:', fs.readdirSync(modelsDir));

// Vérification des imports dans tous les fichiers
const directories = ['controllers', 'routes', 'middleware'];
directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    console.log(`\nVérification des imports dans ${dir}:`);
    fs.readdirSync(dirPath).forEach(file => {
        const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
        if (content.includes('../models/User')) {
            console.log(`⚠️  ${file} contient encore '../models/User'`);
        }
    });
}); 