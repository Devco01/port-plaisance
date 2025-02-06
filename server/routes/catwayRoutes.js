const express = require("express");
const router = express.Router();
const catwayController = require("../controllers/catwayController");
const { protect, admin } = require("../middleware/authMiddleware");

// Debug: vérifions ce qui est importé
console.log("Contenu du contrôleur:", catwayController);
console.log("getAllCatways existe?", !!catwayController.getAllCatways);

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Liste tous les catways
 */
router.get("/", protect, catwayController.getAllCatways);

/**
 * @swagger
 * /api/catways/{id}:
 *   get:
 *     summary: Récupère un catway par son numéro
 */
router.get("/:id", protect, catwayController.getCatway);

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Crée un nouveau catway (admin seulement)
 */
router.post("/", protect, admin, catwayController.createCatway);

/**
 * @swagger
 * /catways/{number}:
 *   put:
 *     summary: Met à jour un catway (admin seulement)
 */
router.put("/:id", protect, admin, catwayController.updateCatway);

/**
 * @swagger
 * /catways/{number}:
 *   delete:
 *     summary: Supprime un catway (admin seulement)
 */
router.delete("/:id", protect, admin, catwayController.deleteCatway);

// Routes pour les réservations
router.get("/:catwayId/reservations", protect, catwayController.getReservationsByCatway);
router.post("/:catwayId/reservations", protect, catwayController.createReservation);
router.put("/:catwayId/reservations/:reservationId", protect, catwayController.updateReservation);
router.delete("/:catwayId/reservations/:reservationId", protect, admin, catwayController.deleteReservation);

module.exports = router;
