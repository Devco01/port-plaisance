const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');

/**
 * @swagger
 * /api/catways/{catwayId}/reservations:
 *   get:
 *     summary: Liste toutes les réservations d'un catway
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, upcoming, past]
 *         description: Filtrer par statut de réservation
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Catway non trouvé
 */
router.get('/:catwayId/reservations', auth, reservationController.getReservations);

/**
 * @swagger
 * /api/catways/{catwayId}/reservations/{id}:
 *   get:
 *     summary: Récupère une réservation spécifique
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation non trouvée
 */
router.get('/:catwayId/reservations/:id', auth, reservationController.getReservationById);

/**
 * @swagger
 * /api/catways/{catwayId}/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
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
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Données invalides ou conflit de dates
 *       404:
 *         description: Catway non trouvé
 */
router.post('/:catwayId/reservations', auth, reservationController.createReservation);

/**
 * @swagger
 * /api/catways/{catwayId}/reservations/{id}:
 *   put:
 *     summary: Modifie une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Réservation modifiée
 *       400:
 *         description: Données invalides ou conflit de dates
 *       404:
 *         description: Réservation non trouvée
 */
router.put('/:catwayId/reservations/:id', auth, reservationController.updateReservation);

/**
 * @swagger
 * /api/catways/{catwayId}/reservations/{id}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
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
router.delete('/:catwayId/reservations/:id', auth, reservationController.deleteReservation);

module.exports = router; 