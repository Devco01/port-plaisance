const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Log pour déboguer
console.log('Routes auth chargées');

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
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Utilisateurs]
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
 *     tags: [Utilisateurs]
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

// Route de test pour vérifier les utilisateurs (à retirer en production)
router.get('/check-users', async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, username: 1, role: 1 });
    res.json({ 
      count: users.length,
      users: users.map(u => ({ email: u.email, role: u.role }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route de test pour la connexion MongoDB
router.get('/test-db', async (req, res) => {
  try {
    // Vérifier la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected');
    }
    
    // Compter les utilisateurs
    const count = await User.countDocuments();
    
    res.json({
      success: true,
      dbStatus: 'connected',
      userCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route de test pour vérifier le mot de passe directement
router.post('/test-password-public', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Test password for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ 
        success: false, 
        message: 'User not found',
        step: 'find_user'
      });
    }

    // Log du hash stocké
    console.log('Stored password hash:', user.password);

    // Test direct avec bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt comparison:', isMatch);

    // Test avec la méthode du modèle
    const isMatchModel = await user.comparePassword(password);
    console.log('Model method comparison:', isMatchModel);

    res.json({
      success: true,
      directMatch: isMatch,
      modelMatch: isMatchModel,
      userDetails: {
        email: user.email,
        role: user.role,
        passwordHash: user.password.substring(0, 10) + '...'
      }
    });
  } catch (error) {
    console.error('Test password error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
