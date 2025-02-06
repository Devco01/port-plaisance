require('dotenv').config();
const mongoose = require('mongoose');

async function resetDatabase() {
    try {
        console.log('🔍 Connexion à MongoDB...');
        console.log('URI:', process.env.MONGODB_URI);
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté');

        await mongoose.connection.dropDatabase();
        console.log('🗑️ Base de données supprimée');

        await mongoose.disconnect();
        console.log('👋 Déconnecté');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

resetDatabase(); 