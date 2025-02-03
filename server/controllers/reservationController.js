const Reservation = require('../models/reservation');
const Catway = require('../models/catway');

/**
 * Liste toutes les réservations d'un catway
 */
exports.getReservations = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        const filter = { catwayNumber: req.params.catwayId };

        // Vérifier si le catway existe
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayId });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        // Filtrer par statut
        if (status) {
            const now = new Date();
            switch (status) {
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

        // Filtrer par période
        if (startDate && endDate) {
            filter.$or = [
                { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
                { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
            ];
        }

        const reservations = await Reservation.find(filter)
            .sort({ startDate: 1 })
            .populate('user', 'username email');

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des réservations' 
        });
    }
};

/**
 * Récupère une réservation spécifique
 */
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            catwayNumber: req.params.catwayId
        }).populate('user', 'username email');

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        // Vérifier les droits d'accès
        if (req.user.role !== 'admin' && req.user.email !== reservation.user.email) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération de la réservation' 
        });
    }
};

/**
 * Crée une nouvelle réservation
 */
exports.createReservation = async (req, res) => {
    try {
        const { startDate, endDate, boatName, boatLength } = req.body;
        const catwayNumber = req.params.catwayId;

        // Vérifier si le catway existe et est disponible
        const catway = await Catway.findOne({ catwayNumber })
            .populate('activeReservations');

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        // Vérifier la taille du bateau
        if (!catway.canAccommodateBoat(boatLength)) {
            return res.status(400).json({ 
                message: 'Le bateau est trop grand pour ce catway' 
            });
        }

        // Vérifier la disponibilité
        if (!catway.isAvailable(new Date(startDate), new Date(endDate))) {
            return res.status(400).json({ 
                message: 'Le catway n\'est pas disponible pour ces dates' 
            });
        }

        const reservation = new Reservation({
            catwayNumber,
            user: req.user._id,
            boatName,
            boatLength,
            startDate,
            endDate
        });

        await reservation.save();

        // Mettre à jour l'état du catway
        catway.catwayState = 'occupé';
        await catway.save();

        res.status(201).json(reservation);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Données invalides', 
                errors: error.errors 
            });
        }
        res.status(500).json({ 
            message: 'Erreur lors de la création de la réservation' 
        });
    }
};

/**
 * Modifie une réservation
 */
exports.updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            catwayNumber: req.params.catwayId
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        // Vérifier les droits d'accès
        if (req.user.role !== 'admin' && req.user.email !== reservation.user.email) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Vérifier les nouvelles dates si modifiées
        if (req.body.startDate || req.body.endDate) {
            const catway = await Catway.findOne({ catwayNumber: req.params.catwayId })
                .populate('activeReservations');

            const newStartDate = new Date(req.body.startDate || reservation.startDate);
            const newEndDate = new Date(req.body.endDate || reservation.endDate);

            const otherReservations = catway.activeReservations.filter(r => 
                r._id.toString() !== reservation._id.toString()
            );

            const hasConflict = otherReservations.some(r => 
                newStartDate <= r.endDate && newEndDate >= r.startDate
            );

            if (hasConflict) {
                return res.status(400).json({ 
                    message: 'Ces dates sont déjà réservées' 
                });
            }
        }

        Object.assign(reservation, req.body);
        await reservation.save();

        res.json(reservation);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Données invalides', 
                errors: error.errors 
            });
        }
        res.status(500).json({ 
            message: 'Erreur lors de la modification de la réservation' 
        });
    }
};

/**
 * Supprime une réservation
 */
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            catwayNumber: req.params.catwayId
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        // Vérifier les droits d'accès
        if (req.user.role !== 'admin' && req.user.email !== reservation.user.email) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        await reservation.remove();

        // Mettre à jour l'état du catway si nécessaire
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayId });
        const hasActiveReservations = await Reservation.exists({
            catwayNumber: req.params.catwayId,
            endDate: { $gte: new Date() }
        });

        if (!hasActiveReservations) {
            catway.catwayState = 'disponible';
            await catway.save();
        }

        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la suppression de la réservation' 
        });
    }
}; 