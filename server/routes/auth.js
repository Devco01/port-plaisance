const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe
 *       example:
 *         email: "john@example.com"
 *         password: "password123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *       example:
 *         success: true
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           username: "john_doe"
 *           email: "john@example.com"
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification des utilisateurs
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get('/logout', auth, logout);

// Routes publiques
router.post('/register', register);

// Routes protégées
router.get('/me', auth, getCurrentUser);

module.exports = router;
