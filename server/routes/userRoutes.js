var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
var userController = require('../controllers/userController');

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
 * /api/users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Users]
 */
router.get('/', auth.auth, auth.isAdmin, userController.getAllUsers);

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Récupère un utilisateur par son email
 *     tags: [Users]
 */
router.get(
    '/:email',
    auth.auth,
    auth.isOwnerOrAdmin(),
    userController.getUserByEmail
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Users]
 */
router.post('/', auth.auth, auth.isAdmin, userController.createUser);

/**
 * @swagger
 * /api/users/{email}:
 *   put:
 *     summary: Modifie un utilisateur
 *     tags: [Users]
 */
router.put(
    '/:email',
    auth.auth,
    auth.isOwnerOrAdmin(),
    userController.updateUser
);

/**
 * @swagger
 * /api/users/{email}:
 *   delete:
 *     summary: Supprime un utilisateur
 *     tags: [Users]
 */
router.delete('/:email', auth.auth, auth.isAdmin, userController.deleteUser);

router.get('/:id', auth.auth, function (req, res) {
    User.findById(req.params.id)
        .select('-password')
        .then(function (user) {
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Utilisateur non trouvé' });
            }
            res.json(user);
        })
        .catch(function (error) {
            res.status(500).json({ message: error.message });
        });
});

module.exports = router;
