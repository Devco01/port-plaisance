const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs de la capitainerie
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nom d'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email unique
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste tous les utilisateurs (admin seulement)
 *     tags: [Users]
 */
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Récupère les détails d'un utilisateur
 *     tags: [Users]
 */
router.get('/:email', auth, async (req, res) => {
    try {
        // Vérifier si l'utilisateur est admin ou demande ses propres infos
        if (req.user.role !== 'admin' && req.user.email !== req.params.email) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const user = await User.findOne({ email: req.params.email }).select('-password');
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
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur (admin seulement)
 *     tags: [Users]
 */
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Vérifier le format du mot de passe
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return res.status(400).json({ 
                message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre' 
            });
        }

        const user = new User(req.body);
        await user.save();

        // Ne pas renvoyer le mot de passe
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     summary: Modifie un utilisateur
 *     tags: [Users]
 */
router.put('/:email', auth, async (req, res) => {
    try {
        // Vérifier les droits d'accès
        if (req.user.role !== 'admin' && req.user.email !== req.params.email) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Empêcher la modification du rôle sauf pour les admins
        if (req.body.role && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Modification du rôle non autorisée' });
        }

        const updates = { ...req.body };

        // Hasher le nouveau mot de passe si fourni
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        } else {
            delete updates.password;
        }

        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            updates,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     summary: Supprime un utilisateur (admin seulement)
 *     tags: [Users]
 */
router.delete('/:email', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Empêcher la suppression d'un admin
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Impossible de supprimer un administrateur' });
        }

        await user.remove();
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
