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
    const { email, password } = req.body;

    try {
        console.log('Tentative de connexion pour:', email);

        // Vérifier que l'email et le mot de passe sont fournis
        if (!email || !password) {
            return res.status(400).json({ msg: 'Veuillez remplir tous les champs' });
        }

        // Rechercher l'utilisateur
        const user = await User.findOne({ email });
        console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');

        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Mot de passe correct:', isMatch ? 'Oui' : 'Non');

        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        // Créer le token
        const payload = {
            user: {
                id: user._id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role || 'user'
            }
        };

        const token = jwt.sign(
            payload, 
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
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
        if (!user) {
            return res.status(404).json({ msg: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
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
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 */
router.put('/:email', auth, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ msg: 'Utilisateur non trouvé' });
        }

        const { nom, prenom } = req.body;
        if (nom) user.nom = nom;
        if (prenom) user.prenom = prenom;

        await user.save();
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
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

// Route temporaire pour créer un utilisateur de test
router.post('/create-test-user', async (req, res) => {
    try {
        const testUser = new User({
            email: 'test@test.com',
            password: await bcrypt.hash('password123', 10),
            nom: 'Test',
            prenom: 'User',
            role: 'admin'
        });
        await testUser.save();
        res.json({ message: 'Utilisateur de test créé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour initialiser les utilisateurs de test
router.post('/init-test-users', async (req, res) => {
    try {
        // D'abord, supprimer les utilisateurs existants
        await User.deleteMany({ 
            email: { 
                $in: ['admin@portplaisance.fr', 'user@portplaisance.fr'] 
            } 
        });

        // Créer l'admin
        const admin = new User({
            email: 'admin@portplaisance.fr',
            password: await bcrypt.hash('PortAdmin2024!', 10),
            nom: 'Admin',
            prenom: 'Port',
            role: 'admin'
        });

        // Créer l'utilisateur standard
        const user = new User({
            email: 'user@portplaisance.fr',
            password: await bcrypt.hash('UserPort2024!', 10),
            nom: 'User',
            prenom: 'Port',
            role: 'user'
        });

        // Sauvegarder les nouveaux utilisateurs
        await Promise.all([
            admin.save(),
            user.save()
        ]);

        res.json({ message: 'Utilisateurs de test créés avec succès' });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route de débogage (à placer AVANT le module.exports)
/**
 * @swagger
 * /users/debug:
 *   get:
 *     summary: Liste tous les utilisateurs (debug)
 *     tags: [Users]
 */
router.get('/debug', async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route simple pour créer un admin
router.post('/create-admin', async (req, res) => {
    try {
        // Supprimer l'admin s'il existe
        await User.deleteOne({ email: 'admin@portplaisance.fr' });

        // Créer le nouvel admin
        const admin = new User({
            email: 'admin@portplaisance.fr',
            password: await bcrypt.hash('PortAdmin2024!', 10),
            nom: 'Admin',
            prenom: 'Port',
            role: 'admin'
        });

        await admin.save();
        res.json({ 
            message: 'Admin créé avec succès',
            credentials: {
                email: 'admin@portplaisance.fr',
                password: 'PortAdmin2024!'
            }
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route de test simple
router.get('/test', (req, res) => {
    res.json({ message: 'Route de test OK' });
});

module.exports = router;


