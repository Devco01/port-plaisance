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

        console.log('=== DEBUG GET ALL CATWAYS ===');
        const catways = await Catway.find().sort({ catwayNumber: 1 });
        console.log('Nombre de catways trouvés:', catways.length);
        console.log('Premier catway:', catways[0]);

        // Vérifier les doublons potentiels
        const catwayNumbers = catways.map(c => c.catwayNumber);
        const uniqueNumbers = [...new Set(catwayNumbers)];
        console.log('Numéros uniques:', uniqueNumbers);
        if (uniqueNumbers.length !== catways.length) {
            console.warn('Attention: Doublons détectés !');
        }

        // Vérifier les trous dans la numérotation
        for (let i = 1; i <= 24; i++) {
            if (!catwayNumbers.includes(i)) {
                console.warn(`Catway manquant: ${i}`);
            }
        }

        console.log('Données à envoyer:', catways);

        res.json({ 
            success: true, 
            data: catways
        });
    } catch (error) {
        console.error('Erreur getAllCatways:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
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
