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
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways récupérée avec succès
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
 *                 enum: [long, short]
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
 *   get:
 *     summary: Récupérer les détails d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Modifier l'état d'un catway
 *     tags: [Catways]
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
 *             type: object
 *             required:
 *               - catwayState
 *             properties:
 *               catwayState:
 *                 type: string
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', [auth, isAdmin], async (req, res) => {
    try {
        // Ne permettre que la modification de l'état
        const { catwayState } = req.body;
        if (!catwayState) {
            return res.status(400).json({ 
                message: 'Seul l\'état du catway peut être modifié' 
            });
        }

        const catway = await Catway.findByIdAndUpdate(
            req.params.id,
            { catwayState },
            { new: true }
        );

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
 * /catways/{id}/reservations:
 *   get:
 *     summary: Liste toutes les réservations d'un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id/reservations', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservations = await Reservation.find({ catwayNumber: req.params.id })
            .sort({ startDate: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     tags: [Reservations]
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
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
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
router.post('/:id/reservations', auth, async (req, res) => {
    try {
        console.log('Création réservation - ID catway:', req.params.id);
        console.log('Données reçues:', req.body);
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        console.log('Catway trouvé:', catway);
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservation = new Reservation({
            catwayNumber: req.params.id,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });
        console.log('Réservation à créer:', reservation);
        await reservation.save();
        console.log('Réservation créée avec succès');
        res.status(201).json(reservation);
    } catch (error) {
        console.error('Erreur création réservation:', error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Modifier une réservation
 */
router.put('/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservation = await Reservation.findOneAndUpdate(
            {
                _id: req.params.idReservation,
                catwayNumber: req.params.id
            },
            req.body,
            { new: true }
        );

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
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation
 */
router.delete('/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservation = await Reservation.findOneAndDelete({
            _id: req.params.idReservation,
            catwayNumber: req.params.id
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


