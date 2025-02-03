const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const auth = require('../middleware/auth');
const Reservation = require('../models/reservation');
const catwayController = require('../controllers/catwayController');

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
 * /catways:
 *   get:
 *     summary: Liste l'ensemble des catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', catwayController.getCatways);

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   get:
 *     summary: Récupère les détails d'un catway
 *     tags: [Catways]
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
 *         description: Détails du catway récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway non trouvé
 */
router.get('/:catwayNumber', auth.requireAuth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        res.json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways:
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
 *         description: Catway créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       400:
 *         description: Données invalides
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', auth.requireAuth, async (req, res) => {
    try {
        // Vérifier si le numéro existe déjà
        const existingCatway = await Catway.findOne({ catwayNumber: req.body.catwayNumber });
        if (existingCatway) {
            return res.status(400).json({ message: 'Ce numéro de catway existe déjà' });
        }

        // Vérifier le type
        if (!['long', 'short'].includes(req.body.catwayType)) {
            return res.status(400).json({ message: 'Type de catway invalide' });
        }

        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   put:
 *     summary: Modifie uniquement l'état d'un catway
 *     tags: [Catways]
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
 *               - catwayState
 *             properties:
 *               catwayState:
 *                 type: string
 *                 description: Nouvel état du catway
 *     responses:
 *       200:
 *         description: État du catway modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       400:
 *         description: Données invalides ou tentative de modification du type
 *       404:
 *         description: Catway non trouvé
 */
router.put('/:catwayNumber', auth.requireAuth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        // Seul l'état peut être modifié
        if (req.body.catwayNumber || req.body.catwayType) {
            return res.status(400).json({ message: 'Seul l\'état peut être modifié' });
        }

        catway.catwayState = req.body.catwayState;
        await catway.save();
        res.json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
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
 *         description: Catway supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Catway supprimé avec succès
 *       404:
 *         description: Catway non trouvé
 */
router.delete('/:catwayNumber', auth.requireAuth, async (req, res) => {
    try {
        // Vérifier les réservations en cours
        const hasReservations = await Reservation.exists({
            catwayNumber: req.params.catwayNumber,
            endDate: { $gte: new Date() }
        });

        if (hasReservations) {
            return res.status(400).json({ 
                message: 'Impossible de supprimer un catway avec des réservations en cours' 
            });
        }

        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        res.json({ message: 'Catway supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
router.post('/:catwayNumber/reservations', auth.requireAuth, async (req, res) => {
    try {
        const reservation = new Reservation({
            ...req.body,
            catwayNumber: req.params.catwayNumber
        });

        const newReservation = await reservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
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
router.put('/:catwayNumber/reservations/:idReservation', auth.requireAuth, async (req, res) => {
    try {
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

module.exports = router;


