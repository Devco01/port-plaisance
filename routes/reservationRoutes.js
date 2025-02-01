const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation.js');
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
 *               - catwayId
 *               - startDate
 *               - endDate
 *             properties:
 *               catwayId:
 *                 type: string
 *                 description: ID du catway à réserver
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Réservation créée
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
        const { catwayId, startDate, endDate } = req.body;

        const reservation = new Reservation({
            user: req.user.id,  // Obtenu du middleware auth
            catway: catwayId,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ 
            message: 'Erreur du serveur',
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Récupère toutes les réservations
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
 *             example:
 *               - user: "60d5ecb8b5c9c62b3c7c1b1e"
 *                 catway: "60d5ecb8b5c9c62b3c7c1b1f"
 *                 startDate: "2024-03-20T00:00:00.000Z"
 *                 endDate: "2024-03-25T00:00:00.000Z"
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('catway')
            .populate('user', '-password');
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;

