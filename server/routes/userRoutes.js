const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const config = require('../config/config');
const isAdmin = require('../middleware/isAdmin');

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
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Erreur de validation ou utilisateur existant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, nom, prenom } = req.body;

        // Vérification que tous les champs sont présents
        if (!email || !password || !nom || !prenom) {
            return res.status(400).json({ msg: 'Tous les champs sont requis' });
        }

        // Vérification si l'utilisateur existe déjà
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'Un utilisateur avec cet email existe déjà' });
        }

        // Création du nouvel utilisateur
        user = new User({
            email,
            password,
            nom,
            prenom
        });

        // Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Création du token JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        res.status(500).send('Erreur serveur');
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
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 */
router.post('/login', async (req, res) => {
    try {
        console.log('👤 Tentative de connexion:', req.body.email);
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ Utilisateur non trouvé:', email);
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('🔐 Vérification mot de passe:', isMatch ? '✅ OK' : '❌ Incorrect');

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Créer le token
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        };

        const token = jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('❌ Erreur de connexion:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ msg: 'Erreur du serveur' });
    }
});

// Middleware pour vérifier le token
const authMiddleware = (req, res, next) => {
    const bearerHeader = req.header('Authorization');
    
    if (!bearerHeader) {
        return res.status(401).json({ msg: 'Aucun token, autorisation refusée' });
    }

    try {
        const bearer = bearerHeader.split(' ');
        
        const token = bearer[1];

        const decoded = jwt.verify(token, config.jwtSecret);
        
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token invalide' });
    }
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 * 
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 */
router.get('/', [auth, isAdmin], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Récupérer les détails d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 * 
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 * 
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:email', auth, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 */
router.post('/', [auth, isAdmin], async (req, res) => {
    try {
        const { email, username, password } = req.body;
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer le nouvel utilisateur
        const user = new User({
            email,
            username,
            password: hashedPassword,
            role: 'user'
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 */
router.put('/:email', auth, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            req.body,
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 */
router.delete('/:email', [auth, isAdmin], async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await User.deleteOne({ email: req.params.email });
        res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Déconnexion utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/logout', auth, (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;


