require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkDb() {
    try {
        console.log('🔍 Connexion à MongoDB...');
        console.log('URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté');

        // Liste toutes les collections
        const collections = await mongoose.connection.db.collections();
        console.log('\n📚 Collections:');
        for (let collection of collections) {
            console.log(' -', collection.collectionName);
            const count = await collection.countDocuments();
            console.log('   Documents:', count);
        }

        // Vérifie la collection users
        console.log('\n👥 Utilisateurs:');
        const users = await User.find({});
        users.forEach(user => {
            console.log('\nUtilisateur trouvé:');
            console.log('- ID:', user._id);
            console.log('- Email:', user.email);
            console.log('- Username:', user.username);
            console.log('- Role:', user.role);
            console.log('- Password Hash:', user.password);
            console.log('- Created:', user.createdAt);
        });

        await mongoose.disconnect();
        console.log('\n👋 Déconnecté');
    } catch (error) {
        console.error('❌ Erreur:', error);
        await mongoose.disconnect();
    }
}

checkDb(); 