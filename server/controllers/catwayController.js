const Catway = require('../models/catway');
const mongoose = require('mongoose');

// Obtenir tous les catways
exports.getAllCatways = async (req, res) => {
    try {
        console.log('GET /catways appelé');
        // Vérifier la connexion à MongoDB
        if (!mongoose.connection.readyState) {
            throw new Error('MongoDB non connecté');
        }

        const catways = await Catway.find();
        console.log('=== Données MongoDB ===');
        console.log('Nombre de catways trouvés:', catways.length);
        console.log('Premier catway:', JSON.stringify(catways[0], null, 2));

        if (!catways.length) {
            console.error('Aucun catway trouvé dans MongoDB');
            return res.json({ 
                success: true, 
                data: [] 
            });
        }

        // Formater les catways avec les bonnes propriétés
        const formattedCatways = catways.map(catway => ({
            _id: catway._id,
            catwayNumber: catway.catwayNumber,
            catwayType: catway.catwayType,
            catwayState: catway.catwayState
        }));

        console.log('Catways formatés:', formattedCatways);

        // Trier par numéro
        const sortedCatways = formattedCatways.sort((a, b) => 
            a.catwayNumber - b.catwayNumber
        );

        res.json({ 
            success: true, 
            data: sortedCatways 
        });
    } catch (error) {
        console.error('Erreur getAllCatways:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: 'Erreur lors de la récupération des catways depuis MongoDB'
        });
    }
};

// Obtenir un catway spécifique
exports.getCatway = async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ success: false, error: 'Catway non trouvé' });
        }
        res.json({ success: true, data: catway });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Créer un catway
exports.createCatway = async (req, res) => {
    try {
        const catway = await Catway.create(req.body);
        res.status(201).json({ success: true, data: catway });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Modifier un catway
exports.updateCatway = async (req, res) => {
    try {
        // On ne permet que la modification de l'état
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },
            { catwayState: req.body.catwayState },
            { new: true, runValidators: true }
        );
        if (!catway) {
            return res.status(404).json({ success: false, error: 'Catway non trouvé' });
        }
        res.json({ success: true, data: catway });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Supprimer un catway
exports.deleteCatway = async (req, res) => {
    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ success: false, error: 'Catway non trouvé' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
