var Reservation = require('../models/reservation');
var Catway = require('../models/catway');
var User = require('../models/user');

/**
 * Liste toutes les réservations d'un catway
 */
exports.getReservations = function(req, res) {
    var filter = { catwayNumber: req.params.catwayId };

    Catway.findOne({ catwayNumber: req.params.catwayId })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }

            if (req.query.status) {
                var now = new Date();
                switch (req.query.status) {
                case 'active':
                    filter.startDate = { $lte: now };
                    filter.endDate = { $gte: now };
                    break;
                case 'upcoming':
                    filter.startDate = { $gt: now };
                    break;
                case 'past':
                    filter.endDate = { $lt: now };
                    break;
                }
            }

            return Reservation.find(filter)
                .sort({ startDate: 1 })
                .populate('user', 'username email');
        })
        .then(function(reservations) {
            res.json(reservations);
        })
        .catch(function(error) {
            var status = error.name === 'ValidationError' ? 400 : 500;
            res.status(status).json({ 
                message: error.message || 'Erreur lors de la récupération des réservations'
            });
        });
};

/**
 * Récupère une réservation spécifique
 */
exports.getReservationById = function(req, res) {
    Reservation.findOne({
        _id: req.params.id,
        catwayNumber: req.params.catwayId
    })
        .populate('user', 'username email')
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }

            // Vérifier les droits d'accès
            if (req.user.role !== 'admin' && req.user.email !== reservation.user.email) {
                return res.status(403).json({ message: 'Accès non autorisé' });
            }

            res.json(reservation);
        })
        .catch(function(error) {
            var status = error.name === 'ValidationError' ? 400 : 500;
            res.status(status).json({ 
                message: error.message || 'Erreur lors de la récupération de la réservation'
            });
        });
};

/**
 * Crée une nouvelle réservation
 */
exports.createReservation = function(req, res) {
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    var boatName = req.body.boatName;
    var boatLength = req.body.boatLength;
    var catwayNumber = req.params.catwayId;
    var foundCatway;

    // Vérifier les dates
    if (endDate <= startDate) {
        return res.status(400).json({ 
            message: 'La date de fin doit être après la date de début' 
        });
    }

    if (startDate < new Date()) {
        return res.status(400).json({ 
            message: 'La date de début ne peut pas être dans le passé' 
        });
    }

    Catway.findOne({ catwayNumber: catwayNumber })
        .populate('activeReservations')
        .then(function(catway) {
            foundCatway = catway;
            if (!catway) {
                throw new Error('Catway non trouvé');
            }

            // Vérifier la taille du bateau
            if (!catway.canAccommodateBoat(boatLength)) {
                throw new Error('Le bateau est trop grand pour ce catway');
            }

            // Vérifier la disponibilité
            if (!catway.isAvailable(startDate, endDate)) {
                throw new Error('Le catway n\'est pas disponible pour ces dates');
            }

            var reservation = new Reservation({
                catwayNumber: catwayNumber,
                user: req.user._id,
                boatName: boatName,
                boatLength: boatLength,
                startDate: startDate,
                endDate: endDate
            });

            return reservation.save();
        })
        .then(function(reservation) {
            // Mettre à jour l'état du catway
            foundCatway.catwayState = 'occupé';
            return foundCatway.save().then(function() {
                return reservation;
            });
        })
        .then(function(reservation) {
            res.status(201).json(reservation);
        })
        .catch(function(error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ 
                    message: 'Données invalides', 
                    errors: error.errors 
                });
            }
            res.status(400).json({ message: error.message });
        });
};

/**
 * Modifie une réservation
 */
exports.updateReservation = function(req, res) {
    var reservation;
    var catway;

    // Vérifier les dates si modifiées
    if (req.body.startDate || req.body.endDate) {
        var startDate = new Date(req.body.startDate);
        var endDate = new Date(req.body.endDate);
        var now = new Date();

        if (endDate <= startDate) {
            return res.status(400).json({ 
                message: 'La date de fin doit être après la date de début' 
            });
        }

        if (startDate < now) {
            return res.status(400).json({ 
                message: 'La date de début ne peut pas être dans le passé' 
            });
        }
    }

    Reservation.findOne({
        _id: req.params.id,
        catwayNumber: req.params.catwayId
    })
        .populate('user', 'username email')
        .then(function(foundReservation) {
            if (!foundReservation) {
                throw new Error('Réservation non trouvée');
            }

            // Vérifier les droits d'accès
            if (req.user.role !== 'admin' && req.user.email !== foundReservation.user.email) {
                throw new Error('Accès non autorisé');
            }

            reservation = foundReservation;

            // Vérifier les nouvelles dates si modifiées
            if (req.body.startDate || req.body.endDate) {
                return Catway.findOne({ catwayNumber: reservation.catwayNumber })
                    .populate('activeReservations');
            }
            return null;
        })
        .then(function(foundCatway) {
            if (foundCatway) {
                catway = foundCatway;
                var newStartDate = new Date(req.body.startDate || reservation.startDate);
                var newEndDate = new Date(req.body.endDate || reservation.endDate);

                var otherReservations = catway.activeReservations.filter(function(r) {
                    return r._id.toString() !== reservation._id.toString();
                });

                var hasConflict = otherReservations.some(function(r) {
                    return newStartDate <= r.endDate && newEndDate >= r.startDate;
                });

                if (hasConflict) {
                    throw new Error('Ces dates sont déjà réservées');
                }
            }

            Object.assign(reservation, req.body);
            return reservation.save();
        })
        .then(function(updatedReservation) {
            res.json(updatedReservation);
        })
        .catch(function(error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ 
                    message: 'Données invalides', 
                    errors: error.errors 
                });
            }
            res.status(400).json({ message: error.message });
        });
};

/**
 * Supprime une réservation
 */
exports.deleteReservation = function(req, res) {
    var foundReservation;
    var foundCatway;

    Reservation.findOne({
        _id: req.params.id,
        catwayNumber: req.params.catwayId
    })
        .populate('user', 'username email')
        .then(function(reservation) {
            if (!reservation) {
                throw new Error('Réservation non trouvée');
            }

            foundReservation = reservation;

            // Vérifier les droits d'accès
            if (req.user.role !== 'admin' && req.user.email !== reservation.user.email) {
                throw new Error('Accès non autorisé');
            }

            return Catway.findOne({ catwayNumber: req.params.catwayId });
        })
        .then(function(catway) {
            if (!catway) {
                throw new Error('Catway non trouvé');
            }
            foundCatway = catway;

            return foundReservation.remove();
        })
        .then(function() {
            // Mettre à jour l'état du catway si nécessaire
            if (foundCatway.activeReservations.length === 0) {
                foundCatway.catwayState = 'disponible';
                return foundCatway.save();
            }
        })
        .then(function() {
            res.json({ message: 'Réservation supprimée avec succès' });
        })
        .catch(function(error) {
            var status = error.message.includes('non trouvé') ? 404 :
                error.message.includes('non autorisé') ? 403 : 500;

            res.status(status).json({ 
                message: error.message 
            });
        });
};

module.exports = {
    getAllReservations: function(req, res) {
        Reservation.find()
            .populate('user', 'username email')
            .then(function(reservations) {
                res.json(reservations);
            })
            .catch(function(error) {
                res.status(500).json({ message: error.message });
            });
    },

    getReservationsByCatway: function(req, res) {
        Reservation.find({ catwayNumber: req.params.catwayNumber })
            .populate('user', 'username email')
            .then(function(reservations) {
                res.json(reservations);
            })
            .catch(function(error) {
                res.status(500).json({ message: error.message });
            });
    },

    createReservation: function(req, res) {
        var foundCatway;
        var newReservation;
        
        Catway.findOne({ catwayNumber: req.params.catwayNumber })
            .then(function(catway) {
                if (!catway) {
                    throw new Error('Catway non trouvé');
                }
                if (catway.catwayState !== 'disponible') {
                    throw new Error('Catway non disponible');
                }
                
                foundCatway = catway;
                newReservation = new Reservation(Object.assign({}, req.body, {
                    catwayNumber: req.params.catwayNumber,
                    user: req.user._id
                }));

                return newReservation.save();
            })
            .then(function(reservation) {
                foundCatway.activeReservations.push(reservation._id);
                return foundCatway.save();
            })
            .then(function() {
                res.status(201).json(newReservation);
            })
            .catch(function(error) {
                var status = error.message.includes('non trouvé') ? 404 :
                    error.message.includes('non disponible') ? 400 : 500;
                    
                res.status(status).json({ message: error.message });
            });
    },

    updateReservation: function(req, res) {
        Reservation.findOne({
            _id: req.params.id,
            catwayNumber: req.params.catwayNumber
        })
            .populate('user', 'email')
            .then(function(reservation) {
                if (!reservation) {
                    return res.status(404).json({ message: 'Réservation non trouvée' });
                }
                
                if (req.user.role !== 'admin' && req.user.email !== reservation.user.email) {
                    return res.status(403).json({ message: 'Accès non autorisé' });
                }

                Object.assign(reservation, req.body);
                return reservation.save();
            })
            .then(function(updatedReservation) {
                res.json(updatedReservation);
            })
            .catch(function(error) {
                if (error.name === 'ValidationError') {
                    return res.status(400).json({ 
                        message: 'Données invalides', 
                        errors: error.errors 
                    });
                }
                res.status(400).json({ message: error.message });
            });
    },

    deleteReservation: function(req, res) {
        var foundReservation;
        var foundCatway;

        Reservation.findOne({
            _id: req.params.id,
            catwayNumber: req.params.catwayNumber
        })
            .populate('user', 'email')
            .then(function(reservation) {
                if (!reservation) {
                    throw new Error('Réservation non trouvée');
                }

                foundReservation = reservation;

                if (req.user.role !== 'admin' && req.user.email !== reservation.user.email) {
                    throw new Error('Accès non autorisé');
                }

                return Catway.findOne({ catwayNumber: req.params.catwayNumber });
            })
            .then(function(catway) {
                if (!catway) {
                    throw new Error('Catway non trouvé');
                }
                foundCatway = catway;

                return foundReservation.remove();
            })
            .then(function() {
                if (foundCatway.activeReservations.length === 0) {
                    foundCatway.catwayState = 'disponible';
                    return foundCatway.save();
                }
            })
            .then(function() {
                res.json({ message: 'Réservation supprimée avec succès' });
            })
            .catch(function(error) {
                var status = error.message.includes('non trouvé') ? 404 :
                    error.message.includes('non autorisé') ? 403 : 500;

                res.status(status).json({ message: error.message });
            });
    }
}; 