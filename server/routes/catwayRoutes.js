var express = require('express');
var router = express.Router();
var Catway = require('../models/catway');
var Reservation = require('../models/reservation');
var authMiddleware = require('../middleware/auth');
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
 *     tags: [Catways]
 *     summary: Liste tous les catways
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrer par type de catway
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filtrer par état
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
router.get('/', authMiddleware.auth, function (req, res, next) {
    Catway.find()
        .then(function (catways) {
            res.json(catways);
        })
        .catch(next);
});

/**
 * @swagger
 * /api/catways/{id}:
 *   get:
 *     tags: [Catways]
 *     summary: Récupère un catway par son ID
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 */
router.get('/:id', authMiddleware.auth, function (req, res, next) {
    Catway.findOne({ catwayNumber: req.params.id })
        .then(function (catway) {
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            res.json(catway);
        })
        .catch(next);
});

/**
 * @swagger
 * /api/catways:
 *   post:
 *     tags: [Catways]
 *     summary: Crée un nouveau catway
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Catway'
 */
router.post(
    '/',
    authMiddleware.auth,
    authMiddleware.isAdmin,
    function (req, res, next) {
        var catway = new Catway(req.body);
        catway
            .save()
            .then(function (saved) {
                res.status(201).json(saved);
            })
            .catch(next);
    }
);

/**
 * @swagger
 * /api/catways/{id}:
 *   put:
 *     tags: [Catways]
 *     summary: Modifie un catway existant
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
 */
router.put(
    '/:id',
    authMiddleware.auth,
    authMiddleware.isAdmin,
    function (req, res, next) {
        Catway.findOneAndUpdate({ catwayNumber: req.params.id }, req.body, {
            new: true
        })
            .then(function (updated) {
                if (!updated) {
                    return res.status(404).json({ error: 'Catway non trouvé' });
                }
                res.json(updated);
            })
            .catch(next);
    }
);

/**
 * @swagger
 * /api/catways/{id}:
 *   delete:
 *     tags: [Catways]
 *     summary: Supprime un catway
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete(
    '/:id',
    authMiddleware.auth,
    authMiddleware.isAdmin,
    function (req, res, next) {
        Reservation.findOne({ catwayNumber: req.params.id })
            .then(function (reservation) {
                if (reservation) {
                    return res.status(400).json({
                        error: 'Impossible de supprimer un catway avec des réservations actives'
                    });
                }
                return Catway.findOneAndDelete({ catwayNumber: req.params.id });
            })
            .then(function (deleted) {
                if (!deleted) {
                    return res.status(404).json({ error: 'Catway non trouvé' });
                }
                res.json({ message: 'Catway supprimé avec succès' });
            })
            .catch(next);
    }
);

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
router.get(
    '/:catwayNumber/reservations',
    authMiddleware.auth,
    function (req, res, next) {
        Reservation.find({ catwayNumber: req.params.catwayNumber })
            .then(function (reservations) {
                res.json(reservations);
            })
            .catch(next);
    }
);

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
router.get(
    '/:catwayNumber/reservations/:idReservation',
    authMiddleware.auth,
    function (req, res, next) {
        Reservation.findOne({
            _id: req.params.idReservation,
            catwayNumber: req.params.catwayNumber
        })
            .then(function (reservation) {
                if (!reservation) {
                    return res
                        .status(404)
                        .json({ message: 'Réservation non trouvée' });
                }
                res.json(reservation);
            })
            .catch(next);
    }
);

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
router.post(
    '/:catwayNumber/reservations',
    authMiddleware.auth,
    function (req, res, next) {
        var reservation = new Reservation(req.body);
        reservation.catwayNumber = req.params.catwayNumber;

        reservation
            .save()
            .then(function (newReservation) {
                res.status(201).json(newReservation);
            })
            .catch(next);
    }
);

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
router.put(
    '/:catwayNumber/reservations/:idReservation',
    authMiddleware.auth,
    function (req, res, next) {
        Reservation.findOneAndUpdate(
            {
                _id: req.params.idReservation,
                catwayNumber: req.params.catwayNumber
            },
            req.body,
            { new: true }
        )
            .then(function (reservation) {
                if (!reservation) {
                    return res
                        .status(404)
                        .json({ message: 'Réservation non trouvée' });
                }
                res.json(reservation);
            })
            .catch(next);
    }
);

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
router.delete(
    '/:catwayNumber/reservations/:idReservation',
    authMiddleware.auth,
    function (req, res, next) {
        Reservation.findOneAndDelete({
            _id: req.params.idReservation,
            catwayNumber: req.params.catwayNumber
        })
            .then(function (reservation) {
                if (!reservation) {
                    return res
                        .status(404)
                        .json({ message: 'Réservation non trouvée' });
                }
                res.json({ message: 'Réservation supprimée avec succès' });
            })
            .catch(next);
    }
);

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Liste les réservations d'un catway
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get('/:id/reservations', authMiddleware.auth, function (req, res, next) {
    Reservation.find({ catwayNumber: req.params.id })
        .then(function (reservations) {
            res.json(reservations);
        })
        .catch(next);
});

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Crée une nouvelle réservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numéro du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Réservation créée
 */
router.post(
    '/:id/reservations',
    authMiddleware.auth,
    function (req, res, next) {
        var reservation = new Reservation({
            catwayNumber: req.params.id,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });

        reservation
            .save()
            .then(function (saved) {
                res.status(201).json(saved);
            })
            .catch(next);
    }
);

module.exports = router;
