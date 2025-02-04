var express = require('express');
var router = express.Router();
var Catway = require('../models/catway');
var auth = require('../middleware/auth'); 
var Reservation = require('../models/reservation');
var _catwayController = require('../controllers/catwayController');

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways et leurs réservations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Catway:
 *       type: object
 *       required:
 *         - catwayNumber
 *         - catwayType
 *         - catwayState
 *       properties:
 *         catwayNumber:
 *           type: string
 *           description: Numéro unique du catway
 *         catwayType:
 *           type: string
 *           enum: [long, short]
 *           description: Type du catway (long ou court)
 *         catwayState:
 *           type: string
 *           description: Description de l'état de la passerelle
 */

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrer par type de catway (long/short)
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filtrer par état du catway
 *     responses:
 *       200:
 *         description: Liste des catways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 */
router.get('/', auth, function(req, res) {
    var query = {};
    if (req.query.type) query.catwayType = req.query.type;
    if (req.query.state) query.catwayState = req.query.state;

    Catway.find(query)
        .then(function(catways) {
            res.json(catways);
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /api/catways/{id}:
 *   get:
 *     summary: Récupère un catway par son ID
 *     tags: [Catways]
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
 *         description: Détails du catway
 *       404:
 *         description: Catway non trouvé
 */
router.get('/:id', auth, function(req, res) {
    Catway.findById(req.params.id)
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            res.json(catway);
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /api/catways:
 *   post:
 *     summary: Crée un nouveau catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Catway'
 *     responses:
 *       201:
 *         description: Catway créé
 *       400:
 *         description: Données invalides
 */
router.post('/', auth, function(req, res) {
    var catway = new Catway(req.body);
    catway.save()
        .then(function(newCatway) {
            res.status(201).json(newCatway);
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message });
        });
});

/**
 * @swagger
 * /api/catways/{id}:
 *   put:
 *     summary: Met à jour un catway
 *     tags: [Catways]
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
 *             $ref: '#/components/schemas/Catway'
 *     responses:
 *       200:
 *         description: Catway mis à jour
 *       404:
 *         description: Catway non trouvé
 */
router.put('/:id', auth, function(req, res) {
    Catway.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            res.json(catway);
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message });
        });
});

/**
 * @swagger
 * /api/catways/{id}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
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
 *         description: Catway supprimé
 *       404:
 *         description: Catway non trouvé
 */
router.delete('/:id', auth, function(req, res) {
    Catway.findByIdAndDelete(req.params.id)
        .then(function(catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            res.json({ message: 'Catway supprimé avec succès' });
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /catways/{catwayNumber}/reservations:
 *   get:
 *     summary: Liste toutes les réservations d'un catway
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
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
 * /catways/{catwayNumber}/reservations/{idReservation}:
 *   get:
 *     summary: Récupère les détails d'une réservation spécifique
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de la réservation récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation ou catway non trouvé
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
 * /catways/{catwayNumber}/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation pour un catway
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Nom du client
 *               boatName:
 *                 type: string
 *                 description: Nom du bateau
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début de la réservation
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de la réservation
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Données invalides ou dates indisponibles
 *       404:
 *         description: Catway non trouvé
 */
router.post('/:catwayNumber/reservations', auth.requireAuth, function(req, res) {
    var reservation = new Reservation(req.body);
    reservation.catwayNumber = req.params.catwayNumber;

    reservation.save()
        .then(function(newReservation) {
            res.status(201).json(newReservation);
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message });
        });
});

/**
 * @swagger
 * /catways/{catwayNumber}/reservations/{idReservation}:
 *   put:
 *     summary: Modifie une réservation existante
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Nom du client
 *               boatName:
 *                 type: string
 *                 description: Nom du bateau
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début de la réservation
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de la réservation
 *     responses:
 *       200:
 *         description: Réservation modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Données invalides ou dates indisponibles
 *       404:
 *         description: Réservation ou catway non trouvé
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
 * /catways/{catwayNumber}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Réservation supprimée avec succès
 *       404:
 *         description: Réservation ou catway non trouvé
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

module.exports = router;
