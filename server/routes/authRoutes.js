var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authMiddleware = require('../middleware/auth');

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
router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email })
        .then(function (user) {
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Email ou mot de passe incorrect' });
            }
            return bcrypt
                .compare(password, user.password)
                .then(function (isMatch) {
                    if (!isMatch) {
                        return res.status(401).json({
                            message: 'Email ou mot de passe incorrect'
                        });
                    }
                    var token = jwt.sign(
                        { id: user._id, role: user.role },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );
                    var userResponse = user.toObject();
                    delete userResponse.password;
                    res.json({
                        user: userResponse,
                        token: token,
                        message: 'Connexion réussie'
                    });
                });
        })
        .catch(function (error) {
            res.status(500).json({ message: error.message });
        });
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
router.get('/logout', authMiddleware.auth, function (req, res) {
    res.clearCookie('token');
    res.json({ message: 'Déconnexion réussie' });
});

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Récupère les informations de l'utilisateur connecté
 *     tags: [Auth]
 */
router.get('/me', authMiddleware.auth, function (req, res) {
    User.findById(req.user.id)
        .select('-password')
        .then(function (user) {
            res.json(user);
        })
        .catch(function (error) {
            res.status(500).json({ message: error.message });
        });
});

/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Change le mot de passe de l'utilisateur connecté
 *     tags: [Auth]
 */
router.post('/change-password', authMiddleware.auth, function (req, res) {
    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;
    var user;

    User.findById(req.user.id)
        .then(function (foundUser) {
            user = foundUser;
            return bcrypt.compare(currentPassword, user.password);
        })
        .then(function (isMatch) {
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ message: 'Mot de passe actuel incorrect' });
            }

            // Vérifier le format du nouveau mot de passe
            var passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({
                    message:
                        'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre'
                });
            }

            return bcrypt.genSalt(10);
        })
        .then(function (salt) {
            return bcrypt.hash(newPassword, salt);
        })
        .then(function (hashedPassword) {
            user.password = hashedPassword;
            return user.save();
        })
        .then(function () {
            res.json({ message: 'Mot de passe modifié avec succès' });
        })
        .catch(function (error) {
            res.status(500).json({ message: error.message });
        });
});

module.exports = router;
