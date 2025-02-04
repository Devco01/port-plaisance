var Catway = require('../models/catway');
var Reservation = require('../models/reservation');
var User = require('../models/user');

/**
 * Liste tous les catways
 */
exports.getAllCatways = function(req, res) {
    var filter = {};
    if (req.query.type) filter.catwayType = req.query.type;
    if (req.query.state) filter.catwayState = req.query.state;

    Catway.find(filter).sort('catwayNumber')
        .then(function(catways) {
            res.json(catways);
        })
        .catch(function(error) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération des catways' 
            });
        });
};

/**
 * Récupère un catway par son numéro
 */
exports.getCatwayById = function(req, res) {
    Catway.findOne({ catwayNumber: req.params.id })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }

            return Reservation.find({
                catwayNumber: catway.catwayNumber,
                endDate: { $gte: new Date() }
            })
                .sort('startDate')
                .then(function(activeReservations) {
                    var catwayObj = catway.toObject();
                    catwayObj.activeReservations = activeReservations;
                    res.json(catwayObj);
                });
        })
        .catch(function(error) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération du catway' 
            });
        });
};

/**
 * Crée un nouveau catway
 */
exports.createCatway = function(req, res) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Action non autorisée' });
    }

    var catwayNumber = req.body.catwayNumber;
    var catwayType = req.body.catwayType;

    // Vérifier si le numéro existe déjà
    Catway.findOne({ catwayNumber: catwayNumber })
        .then(function(existing) {
            if (existing) {
                return res.status(400).json({ 
                    message: 'Ce numéro de catway existe déjà' 
                });
            }

            var catway = new Catway({
                catwayNumber: catwayNumber,
                catwayType: catwayType,
                catwayState: 'disponible'
            });

            return catway.save();
        })
        .then(function(catway) {
            res.status(201).json(catway);
        })
        .catch(function(error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ 
                    message: 'Données invalides', 
                    errors: error.errors 
                });
            }
            res.status(500).json({ 
                message: 'Erreur lors de la création du catway' 
            });
        });
};

/**
 * Modifie l'état d'un catway
 */
exports.updateCatway = function(req, res) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Action non autorisée' });
    }

    var catwayState = req.body.catwayState;

    Catway.findOne({ catwayNumber: req.params.id })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }

            catway.catwayState = catwayState;
            return catway.save();
        })
        .then(function(catway) {
            res.json(catway);
        })
        .catch(function(error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ 
                    message: 'État invalide', 
                    errors: error.errors 
                });
            }
            res.status(500).json({ 
                message: 'Erreur lors de la modification du catway' 
            });
        });
};

/**
 * Supprime un catway
 */
exports.deleteCatway = function(req, res) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Action non autorisée' });
    }

    // Vérifier s'il existe des réservations
    Reservation.exists({
        catwayNumber: req.params.id
    })
        .then(function(hasReservations) {
            if (hasReservations) {
                return res.status(400).json({
                    message: 'Impossible de supprimer un catway ayant des réservations'
                });
            }
            
            return Catway.findOneAndDelete({ 
                catwayNumber: req.params.id 
            });
        })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }

            res.json({ message: 'Catway supprimé avec succès' });
        })
        .catch(function(error) {
            res.status(500).json({ 
                message: 'Erreur lors de la suppression du catway' 
            });
        });
}; 