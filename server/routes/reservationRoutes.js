var express = require('express');
var router = express.Router();
var Reservation = require('../models/reservation');
var auth = require('../middleware/auth');
var Catway = require('../models/catway');

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
 *         - catwayNumber
 *         - clientName
 *         - boatName
 *         - startDate
 *         - endDate
 *       properties:
 *         catwayNumber:
 *           type: string
 *           description: Numéro du catway réservé
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         boatName:
 *           type: string
 *           description: Nom du bateau
 *         startDate:
 *           type: string
 *           format: date
 *           description: Date de début de la réservation
 *         endDate:
 *           type: string
 *           format: date
 *           description: Date de fin de la réservation
 */

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d'un catway
 */
router.get('/catways/:id/reservations', auth, function(req, res) {
    Reservation.find({ catwayId: req.params.id })
        .populate('userId', 'nom prenom email')
        .sort({ startDate: -1 })
        .then(function(reservations) {
            res.json(reservations);
        })
        .catch(function(error) {
            res.status(500).json({ message: 'Erreur serveur' });
        });
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation spécifique
 */
router.get('/catways/:id/reservations/:idReservation', auth, function(req, res) {
    Reservation.findOne({
        _id: req.params.idReservation,
        catwayId: req.params.id
    })
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.json(reservation);
        })
        .catch(function(error) {
            res.status(500).json({ message: 'Erreur serveur' });
        });
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
router.get('/user', auth, function(req, res) {
    Reservation.find({ userId: req.user._id })
        .sort({ startDate: -1 })
        .then(function(reservations) {
            res.json(reservations);
        })
        .catch(function(error) {
            res.status(500).json({ message: 'Erreur serveur' });
        });
});

/**
 * @swagger
 * /catways/:id/reservations:
 *   get:
 *     summary: Liste toutes les réservations d'un catway
 *     tags: [Réservations]
 */
router.get('/:catwayNumber/reservations', auth.requireAuth, function(req, res) {
    Catway.findOne({ catwayNumber: req.params.catwayNumber })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            return Reservation.find({ catwayNumber: req.params.catwayNumber })
                .sort('-startDate');
        })
        .then(function(reservations) {
            res.json(reservations);
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   get:
 *     summary: Récupère les détails d'une réservation
 *     tags: [Réservations]
 */
router.get('/:catwayNumber/reservations/:idReservation', auth.requireAuth, function(req, res) {
    Reservation.findOne({
        _id: req.params.idReservation,
        catwayNumber: req.params.catwayNumber
    })
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.json(reservation);
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /catways/:id/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Réservations]
 */
router.post('/:catwayNumber/reservations', auth.requireAuth, function(req, res) {
    Catway.findOne({ catwayNumber: req.params.catwayNumber })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            var reservation = new Reservation(req.body);
            reservation.catwayNumber = req.params.catwayNumber;
            return reservation.save();
        })
        .then(function(newReservation) {
            res.status(201).json(newReservation);
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message });
        });
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   put:
 *     summary: Modifie une réservation
 *     tags: [Réservations]
 */
router.put('/:catwayNumber/reservations/:idReservation', auth.requireAuth, function(req, res) {
    Reservation.findOneAndUpdate(
        {
            _id: req.params.idReservation,
            catwayNumber: req.params.catwayNumber
        },
        req.body,
        { new: true }
    )
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.json(reservation);
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message });
        });
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Réservations]
 */
router.delete('/:catwayNumber/reservations/:idReservation', auth.requireAuth, function(req, res) {
    Reservation.findOneAndDelete({
        _id: req.params.idReservation,
        catwayNumber: req.params.catwayNumber
    })
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.json({ message: 'Réservation supprimée avec succès' });
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
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
router.get('/current', auth, function(req, res) {
    var today = new Date();
    Reservation.find({
        startDate: { $lte: today },
        endDate: { $gte: today }
    })
        .then(function(reservations) {
            res.json(reservations);
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Liste toutes les réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/', auth, function(req, res) {
    Reservation.find()
        .then(function(reservations) {
            res.json(reservations);
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Récupère une réservation par son ID
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
 *         description: Détails de la réservation
 *       404:
 *         description: Réservation non trouvée
 */
router.get('/:id', auth, function(req, res) {
    Reservation.findById(req.params.id)
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.json(reservation);
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Données invalides
 */
router.post('/', auth, function(req, res) {
    Catway.findOne({ catwayNumber: req.body.catwayNumber })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            var reservation = new Reservation(req.body);
            return reservation.save();
        })
        .then(function(newReservation) {
            res.status(201).json(newReservation);
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message });
        });
});

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Met à jour une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *       404:
 *         description: Réservation non trouvée
 */
router.put('/:id', auth, function(req, res) {
    Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.json(reservation);
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message });
        });
});

module.exports = router;
