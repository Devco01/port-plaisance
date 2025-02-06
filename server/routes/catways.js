const express = require('express');
const router = express.Router();
const { getAllCatways, getCatway, createCatway, updateCatway, deleteCatway } = require('../controllers/catwayController');
const { auth, admin } = require('../middleware/auth');
const Catway = require('../models/catway');  // Correction de la casse

// Protéger toutes les routes
router.use(auth);

// Routes accessibles à tous les utilisateurs authentifiés
/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Catway'
 */
router.get('/', getAllCatways);

/**
 * @swagger
 * /api/catways/{id}:
 *   get:
 *     summary: Récupère un catway par son numéro
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Détails du catway
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Catway'
 */
router.get('/:id', getCatway);

// Routes protégées par admin
router.post('/', admin, createCatway);

/**
 * @swagger
 * /api/catways:
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Catway'
 */
router.put('/:id', admin, updateCatway);

/**
 * @swagger
 * /api/catways/{id}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.delete('/:id', admin, deleteCatway);

module.exports = router;
