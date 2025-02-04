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
 *         - catwayId
 *         - clientName
 *         - boatName
 *         - startDate
 *         - endDate
 *       properties:
 *         catwayId:
 *           type: string
 *           description: ID du catway réservé
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         boatName:
 *           type: string
 *           description: Nom du bateau
 *         startDate:
 *           type: string
 *           format: date
 *           description: Date de début
 *         endDate:
 *           type: string
 *           format: date
 *           description: Date de fin
 */

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     tags: [Réservations]
 *     summary: Récupérer toutes les réservations d'un catway
 */
router.get('/catways/:id/reservations', function (req, res, next) {
    auth(req, res, function () {
        Catway.findById(req.params.id)
            .then(function (catway) {
                if (!catway) {
                    return res
                        .status(404)
                        .json({ message: 'Catway non trouvé' });
                }
                return Reservation.find({ catwayId: req.params.id }).sort(
                    '-startDate'
                );
            })
            .then(function (reservations) {
                res.json(reservations);
            })
            .catch(next);
    });
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation spécifique
 */
router.get(
    '/catways/:id/reservations/:idReservation',
    function (req, res, next) {
        auth(req, res, function () {
            Reservation.findOne({
                _id: req.params.idReservation,
                catwayId: req.params.id
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
        });
    }
);

/**
 * @swagger
 * /reservations/user:
 *   get:
 *     summary: Récupérer les réservations de l'utilisateur connecté
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user', function (req, res, next) {
    auth(req, res, function () {
        Reservation.find({ userId: req.user._id })
            .sort({ startDate: -1 })
            .then(function (reservations) {
                res.json(reservations);
            })
            .catch(next);
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
 */
router.get('/current', function (req, res, next) {
    auth(req, res, function () {
        var today = new Date();
        Reservation.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        })
            .then(function (reservations) {
                res.json(reservations);
            })
            .catch(next);
    });
});

/**
 * @swagger
 * /catways/:id/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Réservations]
 */
router.post('/catways/:id/reservations', function (req, res, next) {
    auth(req, res, function () {
        Catway.findById(req.params.id)
            .then(function (catway) {
                if (!catway) {
                    return res
                        .status(404)
                        .json({ message: 'Catway non trouvé' });
                }
                var reservation = new Reservation(req.body);
                reservation.catwayId = req.params.id;
                return reservation.save();
            })
            .then(function (newReservation) {
                res.status(201).json(newReservation);
            })
            .catch(next);
    });
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Modifier une réservation existante
 */
router.put(
    '/catways/:id/reservations/:idReservation',
    function (req, res, next) {
        auth(req, res, function () {
            Reservation.findOneAndUpdate(
                {
                    _id: req.params.idReservation,
                    catwayId: req.params.id
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
        });
    }
);

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation
 */
router.delete(
    '/catways/:id/reservations/:idReservation',
    function (req, res, next) {
        auth(req, res, function () {
            Reservation.findOneAndDelete({
                _id: req.params.idReservation,
                catwayId: req.params.id
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
        });
    }
);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Liste toutes les réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', function (req, res, next) {
    auth(req, res, function () {
        Reservation.find()
            .then(function (reservations) {
                res.json(reservations);
            })
            .catch(next);
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
 */
router.get('/:id', function (req, res, next) {
    auth(req, res, function () {
        Reservation.findById(req.params.id)
            .then(function (reservation) {
                if (!reservation) {
                    return res
                        .status(404)
                        .json({ message: 'Réservation non trouvée' });
                }
                res.json(reservation);
            })
            .catch(next);
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
 */
router.post('/', function (req, res, next) {
    auth(req, res, function () {
        Catway.findOne({ catwayNumber: req.body.catwayNumber })
            .then(function (catway) {
                if (!catway) {
                    return res
                        .status(404)
                        .json({ message: 'Catway non trouvé' });
                }
                var reservation = new Reservation(req.body);
                return reservation.save();
            })
            .then(function (newReservation) {
                res.status(201).json(newReservation);
            })
            .catch(next);
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
 */
router.put('/:id', function (req, res, next) {
    auth(req, res, function () {
        Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(function (reservation) {
                if (!reservation) {
                    return res
                        .status(404)
                        .json({ message: 'Réservation non trouvée' });
                }
                res.json(reservation);
            })
            .catch(next);
    });
});

module.exports = router;
