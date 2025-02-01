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
    console.log('\n🔵 POST /register - Début de la requête');
    console.log('Body reçu:', {
        email: req.body.email,
        nom: req.body.nom,
        prenom: req.body.prenom,
        // Ne pas logger le password
    });

    const { email, password, nom, prenom } = req.body;
    console.log('Début inscription:', { email, nom, prenom }); // Ne pas logger le password

    try {
        let user = await User.findOne({ email });
        console.log('Recherche utilisateur existant:', user ? 'trouvé' : 'non trouvé');

        if (user) {
            return res.status(400).json({ msg: 'Utilisateur déjà existant' });
        }

        user = new User({
            email,
            password,
            nom,
            prenom
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log('Utilisateur sauvegardé, ID:', user._id);

        const payload = {
            id: user._id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom
        };
        console.log('Payload du token:', payload);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token généré:', token.substring(0, 20) + '...');

        // Modification ici : utilisons json() au lieu de send()
        res.status(201).json({ 
            token,
            user: {
                id: user._id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom
            }
        });
        console.log('Réponse envoyée avec succès');

    } catch (error) {
        console.error('Erreur lors de l inscription:', error);
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        // Créer le token avec toutes les informations nécessaires
        const payload = {
            id: user._id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
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

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
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


