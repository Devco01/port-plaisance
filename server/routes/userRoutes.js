var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var auth = require('../middleware/auth');
var isAdmin = require('../middleware/isAdmin');

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
router.get('/', auth, isAdmin, function(req, res) {
    User.find()
        .select('-password')
        .then(function(users) {
            res.json(users);
        })
        .catch(function(error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Récupère les détails d'un utilisateur
 *     tags: [Users]
 */
router.get('/:email', auth, function(req, res) {
    try {
        // Vérifier si l'utilisateur est admin ou demande ses propres infos
        if (req.user.role !== 'admin' && req.user.email !== req.params.email) {

            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        User.findOne({ email: req.params.email }).select('-password')
            .then(function(user) {
                if (!user) {
                    return res.status(404).json({ message: 'Utilisateur non trouvé' });
                }
                res.json(user);
            })
            .catch(function(error) {
                res.status(500).json({ message: error.message });
            });


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
router.post('/', auth, isAdmin, function(req, res) {
    User.findOne({ email: req.body.email })
        .then(function(existingUser) {
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }

            var passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(req.body.password)) {
                return res.status(400).json({ 
                    message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre' 
                });
            }

            return bcrypt.hash(req.body.password, 10);
        })
        .then(function(hashedPassword) {
            var user = new User(req.body);
            user.password = hashedPassword;
            return user.save();

        })
        .then(function(user) {
            var userResponse = user.toObject();
            delete userResponse.password;
            res.status(201).json(userResponse);
        })
        .catch(function(error) {
            res.status(400).json({ message: error.message });
        });
});

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     summary: Modifie un utilisateur
 *     tags: [Users]
 */
router.put('/:email', auth, function(req, res) {
    try {
        // Vérifier les droits d'accès
        if (req.user.role !== 'admin' && req.user.email !== req.params.email) {

            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Empêcher la modification du rôle sauf pour les admins
        if (req.body.role && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Modification du rôle non autorisée' });
        }

        var updates = req.body;

        // Hasher le nouveau mot de passe si fourni

        if (updates.password) {
            var salt = bcrypt.genSalt(10);
            updates.password = bcrypt.hash(updates.password, salt);
        } else {
            delete updates.password;
        }


        User.findOneAndUpdate(
            { email: req.params.email },
            updates,
            { new: true }
        ).select('-password')
            .then(function(user) {



        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

                res.json(user);
            })
            .catch(function(error) {
                res.status(400).json({ message: error.message });
            });
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
router.delete('/:email', auth, isAdmin, function(req, res) {
    try {
        User.findOne({ email: req.params.email })
            .then(function(user) {
                if (!user) {

            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Empêcher la suppression d'un admin
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Impossible de supprimer un administrateur' });
        }

        user.remove();
        res.json({ message: 'Utilisateur supprimé avec succès' });

            })
            .catch(function(error) {
                res.status(400).json({ message: error.message });
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
