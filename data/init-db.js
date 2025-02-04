const User = require('../server/models/user');
const Catway = require('../server/models/catway');
const bcrypt = require('bcryptjs');

const initializeDB = async () => {
    try {
        console.log('🔄 Initialisation de la base de données...');

        // Créer l'admin par défaut
        const adminExists = await User.findOne({
            email: 'admin@portplaisance.fr'
        });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('PortAdmin2024!', 10);
            await User.create({
                email: 'admin@portplaisance.fr',
                password: hashedPassword,
                nom: 'Admin',
                prenom: 'System',
                role: 'admin'
            });
            console.log('✅ Admin créé');
        }

        // Créer les catways par défaut
        const catwaysExist = await Catway.countDocuments();
        if (!catwaysExist) {
            const catways = [];
            // Créer 10 catways courts
            for (let i = 1; i <= 10; i++) {
                catways.push({
                    catwayNumber: i,
                    catwayType: 'court',
                    catwayState: 'disponible'
                });
            }
            // Créer 5 catways longs
            for (let i = 11; i <= 15; i++) {
                catways.push({
                    catwayNumber: i,
                    catwayType: 'long',
                    catwayState: 'disponible'
                });
            }
            await Catway.insertMany(catways);
            console.log('✅ Catways créés');
        }

        console.log('✅ Base de données initialisée avec succès');
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
        throw error;
    }
};

module.exports = initializeDB;
