const Catway = require('../models/catway');

// Obtenir tous les catways
exports.getAllCatways = async (req, res) => {
    try {
        console.log('GET /catways appelé');
        const catways = await Catway.find();
        console.log('Catways trouvés:', catways);
        // Trier par numéro de catway
        const sortedCatways = catways.sort((a, b) => 

            parseInt(a.catwayNumber) - parseInt(b.catwayNumber)
        );
        res.json({ success: true, data: sortedCatways });
    } catch (error) {
        console.error('Erreur getAllCatways:', error);
        res.status(500).json({ success: false, error: error.message });
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
