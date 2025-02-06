const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const { authenticateToken } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Liste toutes les réservations d'un catway
 *   post:
 *     tags: [Reservations]
 *     summary: Crée une nouvelle réservation
 * 
 * /api/catways/{id}/reservations/{idReservation}:
 *   get:
 *     tags: [Reservations]
 *     summary: Récupère une réservation spécifique
 *   put:
 *     tags: [Reservations]
 *     summary: Modifie une réservation
 *   delete:
 *     tags: [Reservations]
 *     summary: Supprime une réservation
 */

// Debug: vérifions le contenu du contrôleur
console.log("Contrôleur complet:", reservationController);
console.log("Méthodes disponibles:", Object.keys(reservationController));

// Vérifions chaque méthode individuellement
console.log("getReservations existe?", !!reservationController.getReservations);
console.log("getReservationsByCatway existe?", !!reservationController.getReservationsByCatway);
console.log("getAllReservations existe?", !!reservationController.getAllReservations);

// Routes pour les réservations (sous-ressource des catways)
// Important : la route "current" doit être AVANT la route avec :idReservation
router.get("/catways/:id/reservations/current", authenticateToken, reservationController.getCurrentReservationsByCatway);
router.get("/catways/:id/reservations", authenticateToken, reservationController.getReservationsByCatway);
router.get("/catways/:id/reservations/:idReservation", authenticateToken, reservationController.getReservationById);
router.post("/catways/:id/reservations", authenticateToken, reservationController.createReservation);
router.put("/catways/:id/reservations/:idReservation", authenticateToken, reservationController.updateReservation);
router.delete("/catways/:id/reservations/:idReservation", authenticateToken, reservationController.deleteReservation);

module.exports = router;
