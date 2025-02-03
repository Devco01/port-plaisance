<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const auth = require('../middleware/auth');
const Catway = require('../models/catway');

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - catway
 *         - startDate
 *         - endDate
 *       properties:
 *         user:
 *           type: string
 *           description: ID de l'utilisateur
 *         catway:
 *           type: string
 *           description: ID du catway
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Date de début de la réservation
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Date de fin de la réservation
 */

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d'un catway
 */
router.get('/catways/:id/reservations', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayId: req.params.id })
            .populate('userId', 'nom prenom email')
            .sort({ startDate: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation spécifique
 */
router.get('/catways/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayId: req.params.id
        });
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /reservations/user:
 *   get:
 *     summary: Récupérer les réservations de l'utilisateur connecté
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations de l'utilisateur
 */
router.get('/user', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ userId: req.user._id })
            .sort({ startDate: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways/:id/reservations:
 *   get:
 *     summary: Liste toutes les réservations d'un catway
 *     tags: [Réservations]
 */
router.get('/:catwayNumber/reservations', auth.requireAuth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservations = await Reservation.find({ catwayNumber: req.params.catwayNumber })
            .sort('-startDate');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   get:
 *     summary: Récupère les détails d'une réservation
 *     tags: [Réservations]
 */
router.get('/:catwayNumber/reservations/:idReservation', auth.requireAuth, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayNumber: req.params.catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/:id/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Réservations]
 */
router.post('/:catwayNumber/reservations', auth.requireAuth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        if (catway.catwayState !== 'disponible') {
            return res.status(400).json({ message: 'Ce catway n\'est pas disponible' });
        }

        // Vérifier les dates
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
            return res.status(400).json({ message: 'La date de début ne peut pas être dans le passé' });
        }

        if (endDate <= startDate) {
            return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
        }

        // Vérifier les conflits de réservation
        const conflictingReservation = await Reservation.findOne({
            catwayNumber: req.params.catwayNumber,
            $or: [
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate }
                }
            ]
        });

        if (conflictingReservation) {
            return res.status(400).json({ message: 'Ce catway est déjà réservé pour cette période' });
        }

        const reservation = new Reservation({
            ...req.body,
            catwayNumber: req.params.catwayNumber
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   put:
 *     summary: Modifie une réservation
 *     tags: [Réservations]
 */
router.put('/:catwayNumber/reservations/:idReservation', auth.requireAuth, async (req, res) => {
    try {
        // Vérifier les dates si elles sont modifiées
        if (req.body.startDate || req.body.endDate) {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (startDate < today) {
                return res.status(400).json({ message: 'La date de début ne peut pas être dans le passé' });
            }

            if (endDate <= startDate) {
                return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
            }

            // Vérifier les conflits de réservation
            const conflictingReservation = await Reservation.findOne({
                _id: { $ne: req.params.idReservation },
                catwayNumber: req.params.catwayNumber,
                $or: [
                    {
                        startDate: { $lte: endDate },
                        endDate: { $gte: startDate }
                    }
                ]
            });

            if (conflictingReservation) {
                return res.status(400).json({ message: 'Ce catway est déjà réservé pour cette période' });
            }
        }

        const reservation = await Reservation.findOneAndUpdate(
            {
                _id: req.params.idReservation,
                catwayNumber: req.params.catwayNumber
            },
            req.body,
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Réservations]
 */
router.delete('/:catwayNumber/reservations/:idReservation', auth.requireAuth, async (req, res) => {
    try {
        const reservation = await Reservation.findOneAndDelete({
            _id: req.params.idReservation,
            catwayNumber: req.params.catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /reservations/current:
 *   get:
 *     summary: Récupérer les réservations en cours
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations en cours
 */
router.get('/current', auth, async (req, res) => {
    try {
        const today = new Date();
        const reservations = await Reservation.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

=======
const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user
 *         - catway
 *         - startDate
 *         - endDate
 *       properties:
 *         user:
 *           type: string
 *           description: ID de l'utilisateur
 *         catway:
 *           type: string
 *           description: ID du catway
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Date de début de la réservation
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Date de fin de la réservation
 */

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d'un catway
 */
router.get('/catways/:id/reservations', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayId: req.params.id })
            .populate('userId', 'nom prenom email')
            .sort({ startDate: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation spécifique
 */
router.get('/catways/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayId: req.params.id
        });
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /reservations/user:
 *   get:
 *     summary: Récupérer les réservations de l'utilisateur connecté
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations de l'utilisateur
 */
router.get('/user', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ userId: req.user._id })
            .sort({ startDate: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayNumber
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               catwayNumber:
 *                 type: string
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 */
router.post('/', auth, async (req, res) => {
    try {
        const reservation = new Reservation({
            ...req.body,
            userId: req.user._id
        });
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *       404:
 *         description: Réservation non trouvée
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) {
            return res.status(404).json({ msg: 'Réservation non trouvée' });
        }
        res.json({ msg: 'Réservation supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur' });
    }
});

/**
 * @swagger
 * /reservations/current:
 *   get:
 *     summary: Récupérer les réservations en cours
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations en cours
 */
router.get('/current', auth, async (req, res) => {
    try {
        const today = new Date();
        const reservations = await Reservation.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

>>>>>>> 9e1db78a25cb06c03b52345848bd5bfc84fe2764
