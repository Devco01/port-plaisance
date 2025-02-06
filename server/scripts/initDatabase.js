const User = require('../models/User');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

const initDatabase = async () => {
    try {
        // Suppression des données existantes
        await Promise.all([
            User.deleteMany({}),
            Catway.deleteMany({}),
            Reservation.deleteMany({})
        ]);

        console.log('✅ Base de données nettoyée');

        // Création d'un utilisateur admin par défaut
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        // Création des catways
        const catways = await Catway.insertMany([
            // ... vos données de catways
        ]);

        // Création de quelques réservations de test
        await Reservation.insertMany([
            {
                catwayNumber: catways[0].catwayNumber,
                clientName: 'John Doe',
                boatName: 'Sea Spirit',
                startDate: new Date('2025-02-01'),
                endDate: new Date('2025-02-15'),
                status: 'confirmed',
                user: adminUser._id
            },
            {
                catwayNumber: catways[1].catwayNumber,
                clientName: 'Jane Smith',
                boatName: 'Wave Runner',
                startDate: new Date('2025-03-01'),
                endDate: new Date('2025-03-10'),
                status: 'pending',
                user: adminUser._id
            }
        ]);

        console.log('✅ Données initiales créées');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        process.exit(1);
    }
};

module.exports = initDatabase;