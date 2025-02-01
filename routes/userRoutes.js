const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - nom
 *         - prenom
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe de l'utilisateur
 *         nom:
 *           type: string
 *           description: Nom de l'utilisateur
 *         prenom:
 *           type: string
 *           description: Prénom de l'utilisateur
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nom
 *               - prenom
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 */
router.post('/register', async (req, res) => {
    console.log('Données reçues:', req.body);
    const { email, password, nom, prenom } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        console.log('Utilisateur existant:', user);
        
        if (user) {
            return res.status(400).json({ msg: 'Utilisateur déjà existant' });
        }

        // Créer un nouvel utilisateur
        user = new User({
            email,
            password,
            nom,
            prenom
        });

        console.log('Nouvel utilisateur avant sauvegarde:', user);

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log('Utilisateur sauvegardé avec succès');

        res.status(201).json({ msg: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error('Erreur complète:', error);
        res.status(500).json({ 
            msg: 'Erreur du serveur',
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Users]
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
 *               password:
 *                 type: string
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        // Créer et retourner un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

// Middleware pour vérifier le token
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'Aucun token, autorisation refusée' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token invalide' });
    }
};

// Exemple d'utilisation du middleware
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;


