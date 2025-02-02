const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Reservation = require('../models/reservation');
const config = require('../config/config');

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways
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
 *           description: Type de catway (long ou court)
 *         catwayState:
 *           type: string
 *           description: État actuel du catway
 */

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Récupère tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', auth, async (req, res) => {
    try {
        const catways = await Catway.find();
        return res
            .status(200)
            .set('Content-Type', 'application/json')
            .json(catways);
    } catch (error) {
        console.error('Erreur récupération catways:', error);
        return res
            .status(500)
            .set('Content-Type', 'application/json')
            .json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Créer un nouveau catway
 *     tags: [Catways]
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
 *               - catwayType
 *               - catwayState
 *             properties:
 *               catwayNumber:
 *                 type: string
 *               catwayType:
 *                 type: string
 *                 enum: [short, long]
 *               catwayState:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', [auth, isAdmin], async (req, res) => {
    try {
        console.log('Tentative de création de catway:', req.body);
        const { catwayNumber, catwayType, catwayState } = req.body;
        const catway = new Catway({
            catwayNumber,
            catwayType,
            catwayState
        });
        console.log('Catway créé:', catway);
        await catway.save();
        console.log('Catway sauvegardé avec succès');
        return res
            .status(201)
            .set('Content-Type', 'application/json')
            .json(catway);
    } catch (error) {
        console.error('Erreur lors de la création du catway:', error);
        return res
            .status(500)
            .set('Content-Type', 'application/json')
            .json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Mettre à jour un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Catway'
 *     responses:
 *       200:
 *         description: Catway mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', [auth, isAdmin], async (req, res) => {
    try {
        const { catwayState } = req.body;
        
        if (!catwayState) {
            return res
                .status(400)
                .set('Content-Type', 'application/json')
                .json({ message: 'L\'état du catway est requis' });
        }

        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res
                .status(404)
                .set('Content-Type', 'application/json')
                .json({ message: 'Catway non trouvé' });
        }

        catway.catwayState = catwayState;
        await catway.save();

        return res
            .status(200)
            .set('Content-Type', 'application/json')
            .json(catway);
    } catch (error) {
        console.error('Erreur modification:', error);
        return res
            .status(500)
            .set('Content-Type', 'application/json')
            .json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du catway
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        // Vérifier si le catway existe
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res
                .status(404)
                .json({ message: 'Catway non trouvé' });
        }

        // Vérifier s'il y a des réservations associées
        const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber });
        if (reservations.length > 0) {
            return res
                .status(400)
                .set('Content-Type', 'application/json')
                .json({ 
                    success: false,
                    message: 'Impossible de supprimer ce catway car il a des réservations associées'
                });
        }

        // Supprimer le catway
        await Catway.deleteOne({ _id: req.params.id });
        
        return res
            .status(200)
            .json({ message: 'Catway supprimé avec succès' });

    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        return res
            .status(500)
            .set('Content-Type', 'application/json')
            .json({
                success: false,
                message: 'Erreur serveur lors de la suppression',
                error: error.message
            });
    }
});

/**
 * @swagger
 * /catways/:id/reservations:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/:id/reservations', auth, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        // Vérifier les chevauchements de dates
        const { startDate, endDate } = req.body;
        const overlappingReservation = await Reservation.findOne({
            catwayId: req.params.id,
            $or: [
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate }
                }
            ]
        });

        if (overlappingReservation) {
            return res.status(400).json({ message: 'Il existe déjà une réservation pour cette période' });
        }

        const reservation = new Reservation({
            ...req.body,
            catwayId: req.params.id,
            catwayNumber: catway.catwayNumber
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findOneAndDelete({
            _id: req.params.idReservation,
            catwayId: req.params.id
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;


