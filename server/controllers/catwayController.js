const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const User = require('../models/user');

/**
 * Liste tous les catways
 */
exports.getAllCatways = async (req, res) => {
    try {
        const { type, state } = req.query;
        const filter = {};

        // Appliquer les filtres si présents
        if (type) filter.catwayType = type;
        if (state) filter.catwayState = state;

        const catways = await Catway.find(filter).sort('catwayNumber');
        res.json(catways);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des catways' 
        });
    }
};

/**
 * Récupère un catway par son numéro
 */
exports.getCatwayById = async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        // Récupérer les réservations actives pour ce catway
        const activeReservations = await Reservation.find({
            catwayNumber: catway.catwayNumber,
            endDate: { $gte: new Date() }
        }).sort('startDate');

        res.json({
            ...catway.toObject(),
            activeReservations
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération du catway' 
        });
    }
};

/**
 * Crée un nouveau catway
 */
exports.createCatway = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Action non autorisée' });
        }

        const { catwayNumber, catwayType } = req.body;

        // Vérifier si le numéro existe déjà
        const existing = await Catway.findOne({ catwayNumber });
        if (existing) {
            return res.status(400).json({ 
                message: 'Ce numéro de catway existe déjà' 
            });
        }

        const catway = new Catway({
            catwayNumber,
            catwayType,
            catwayState: 'disponible'
        });

        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Données invalides', 
                errors: error.errors 
            });
        }
        res.status(500).json({ 
            message: 'Erreur lors de la création du catway' 
        });
    }
};

/**
 * Modifie l'état d'un catway
 */
exports.updateCatway = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Action non autorisée' });
        }

        const { catwayState } = req.body;
        const catway = await Catway.findOne({ catwayNumber: req.params.id });

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        // Seul l'état peut être modifié
        catway.catwayState = catwayState;
        await catway.save();

        res.json(catway);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'État invalide', 
                errors: error.errors 
            });
        }
        res.status(500).json({ 
            message: 'Erreur lors de la modification du catway' 
        });
    }
};

/**
 * Supprime un catway
 */
exports.deleteCatway = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Action non autorisée' });
        }

        // Vérifier s'il existe des réservations
        const hasReservations = await Reservation.exists({
            catwayNumber: req.params.id
        });

        if (hasReservations) {
            return res.status(400).json({
                message: 'Impossible de supprimer un catway ayant des réservations'
            });
        }

        const catway = await Catway.findOneAndDelete({ 
            catwayNumber: req.params.id 
        });

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        res.json({ message: 'Catway supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la suppression du catway' 
        });
    }
}; 