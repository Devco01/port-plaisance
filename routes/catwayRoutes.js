const express = require('express');
const router = express.Router();
const Catway = require('../models/catway.js');
const auth = require('../middleware/auth');

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
        res.json(catways);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

/**
 * @swagger
 * /catways/{id}:
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
 *         description: ID MongoDB du catway
 *     responses:
 *       200:
 *         description: Détails du catway
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *             example:
 *               catwayNumber: "1"
 *               catwayType: "short"
 *               catwayState: "disponible"
 *       404:
 *         description: Catway non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *             example:
 *               msg: "Catway non trouvé"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ msg: 'Catway non trouvé' });
        }
        res.json(catway);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
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
 *             $ref: '#/components/schemas/Catway'
 *           example:
 *             catwayNumber: "1"
 *             catwayType: "short"
 *             catwayState: "disponible"
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
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', auth, async (req, res) => {
    try {
        console.log('Body reçu:', req.body);
        const { catwayNumber, catwayType, catwayState } = req.body;
        console.log('Données extraites:', { catwayNumber, catwayType, catwayState });
        
        const catway = new Catway({
            catwayNumber,
            catwayType,
            catwayState
        });
        console.log('Catway créé:', catway);
        
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send('Erreur du serveur');
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
router.put('/:id', auth, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ msg: 'Catway non trouvé' });
        }
        const { catwayNumber, catwayType, catwayState } = req.body;
        catway.catwayNumber = catwayNumber;
        catway.catwayType = catwayType;
        catway.catwayState = catwayState;
        await catway.save();
        res.json(catway);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send('Erreur du serveur');
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
router.delete('/:id', auth, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ msg: 'Catway non trouvé' });
        }
        await catway.remove();
        res.json({ msg: 'Catway supprimé avec succès' });
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send('Erreur du serveur');
    }
});

/**
 * @swagger
 * /catways/:id/reservations:
 *   get:
 *     summary: Récupère les réservations d'un catway
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
 *         description: Liste des réservations du catway
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Catway non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *             example:
 *               msg: "Catway non trouvé"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/reservations', auth, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ msg: 'Catway non trouvé' });
        }
        const reservations = await Reservation.find({ catway: req.params.id });
        res.json(reservations);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send('Erreur du serveur');
    }
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   get:
 *     summary: Récupère une réservation d'un catway
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
 *         description: Détails de la réservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *             example:
 *               msg: "Réservation non trouvée"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ msg: 'Catway non trouvé' });
        }
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ msg: 'Réservation non trouvée' });
        }
        res.json(reservation);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send('Erreur du serveur');
    }
});

/**
 * @swagger
 * /catways/:id/reservations:
 *   post:
 *     summary: Créer une nouvelle réservation pour un catway
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
            return res.status(404).json({ msg: 'Catway non trouvé' });
        }
        const { date, heure } = req.body;
        const reservation = new Reservation({
            date,
            heure,
            catway: req.params.id
        });
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send('Erreur du serveur');
    }
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   put:
 *     summary: Mettre à jour une réservation pour un catway
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
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
router.put('/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ msg: 'Catway non trouvé' });
        }
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ msg: 'Réservation non trouvée' });
        }
        const { date, heure } = req.body;
        reservation.date = date;
        reservation.heure = heure;
        await reservation.save();
        res.json(reservation);
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send('Erreur du serveur');
    }
});

/**
 * @swagger
 * /catways/:id/reservations/:idReservation:
 *   delete:
 *     summary: Supprimer une réservation pour un catway
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
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res.status(404).json({ msg: 'Catway non trouvé' });
        }
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ msg: 'Réservation non trouvée' });
        }
        await reservation.remove();
        res.json({ msg: 'Réservation supprimée avec succès' });
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;


