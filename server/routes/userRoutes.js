const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs (admin seulement)
 *     security:
 *       - bearerAuth: []
 */
router.get("/", protect, admin, userController.getUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtient le profil de l'utilisateur connecté
 */
router.get("/me", protect, userController.getCurrentUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtient un utilisateur par son ID (admin seulement)
 */
router.get("/:id", protect, admin, userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur (admin seulement)
 */
router.post("/", protect, admin, userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Met à jour un utilisateur (admin ou propriétaire)
 */
router.put("/:id", protect, admin, userController.updateUser);

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     summary: Supprime un utilisateur par son email (admin seulement)
 */
router.delete("/:email", protect, admin, userController.deleteUser);

// Route d'inscription publique
router.post('/register', authController.register);

module.exports = router;
