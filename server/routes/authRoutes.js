const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification des utilisateurs
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentifie un utilisateur
 *     tags: [Auth]
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
 *                 example: admin@port-russell.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin123!
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     role:
 *                       type: string
 *                     email:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Créer le token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Stocker le token dans un cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 heures
        });

        // Renvoyer les infos utilisateur sans le mot de passe
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            user: userResponse,
            message: 'Connexion réussie'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Déconnecte l'utilisateur
 *     tags: [Auth]
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
 *                 message:
 *                   type: string
 *                   example: Déconnexion réussie
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/logout', auth.requireAuth, (req, res) => {
    try {
        // Supprimer le cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     tags: [Auth]
 */
router.get('/me', auth.requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Change le mot de passe de l'utilisateur connecté
 *     tags: [Auth]
 */
router.post('/change-password', auth.requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Vérifier l'ancien mot de passe
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
        }

        // Vérifier le format du nouveau mot de passe
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                message: 'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre' 
            });
        }

        // Hasher et sauvegarder le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 