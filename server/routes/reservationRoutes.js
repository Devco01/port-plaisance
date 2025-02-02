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
 * /reservations:
 *   get:
 *     summary: Récupérer toutes les réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get('/', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('userId', 'nom prenom email')
            .sort({ startDate: -1 });
        res.json(reservations);
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

module.exports = router;

