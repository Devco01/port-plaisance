require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
    try {
        console.log('🔍 Variables d\'environnement:');
        console.log('MONGODB_URI:', process.env.MONGODB_URI);
        console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        // Vérifier la base de données actuelle
        const collections = await mongoose.connection.db.collections();
        console.log('📚 Collections dans la base de données:');
        for (let collection of collections) {
            console.log(' -', collection.collectionName);
        }

        // Compter les utilisateurs existants
        const userCount = await User.countDocuments();
        console.log('👥 Nombre d\'utilisateurs existants:', userCount);

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@portplaisance.fr';
        const adminPassword = process.env.ADMIN_PASSWORD || 'PortAdmin2024!';

        // Supprimer l'ancien admin s'il existe
        await User.deleteOne({ email: adminEmail });
        console.log('🗑️ Ancien admin supprimé');

        // Créer le nouvel admin
        const admin = await User.create({
            username: 'Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        console.log('✨ Nouvel admin créé:');
        console.log('Email:', admin.email);
        console.log('Username:', admin.username);
        console.log('Role:', admin.role);
        console.log('ID:', admin._id);

        // Vérifier que l'admin est bien créé
        const verifyAdmin = await User.findOne({ email: adminEmail });
        console.log('🔍 Vérification admin:', verifyAdmin ? 'Trouvé' : 'Non trouvé');

        await mongoose.disconnect();
        console.log('👋 Déconnecté de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createAdmin(); 