var express = require("express");
var router = express.Router();
var auth = require("../middleware/auth");
var isAdmin = require("../middleware/isAdmin");
var User = require("../models/user");
var Catway = require("../models/catway");
var Reservation = require("../models/reservation");
var jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Frontend
 *   description: Routes pour l'interface utilisateur
 */

/**
 * @swagger
 * /api:
 *   get:
 *     tags: [Frontend]
 *     summary: Page d'accueil de l'API
 */
router.get("/", function (req, res) {
    res.json({
        message: "API Port de Plaisance",
        version: "1.0.0"
    });
});

/**
 * @swagger
 * /dashboard/catways/{id}:
 *   get:
 *     tags: [Frontend]
 *     summary: Détails d'un catway
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/dashboard/catways/:id", function (req, res, next) {
    auth(req, res, function () {
        Catway.findById(req.params.id)
            .then(function (catway) {
                if (!catway) {
                    return res
                        .status(404)
                        .json({ message: "Catway non trouvé" });
                }
                return Reservation.find({ catwayId: req.params.id })
                    .sort("-startDate")
                    .then(function (reservations) {
                        res.json({
                            catway: catway,
                            reservations: reservations
                        });
                    });
            })
            .catch(next);
    });
});

/**
 * @swagger
 * /dashboard/users/{id}:
 *   get:
 *     tags: [Frontend]
 *     summary: Détails d'un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/dashboard/users/:id", function (req, res, next) {
    auth(req, res, function () {
        isAdmin(req, res, function () {
            User.findById(req.params.id)
                .select("-password")
                .then(function (user) {
                    if (!user) {
                        return res
                            .status(404)
                            .json({ message: "Utilisateur non trouvé" });
                    }
                    res.json(user);
                })
                .catch(next);
        });
    });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion utilisateur
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
router.post("/auth/login", function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email })
        .then(function (user) {
            if (!user) {
                return res
                    .status(401)
                    .json({ message: "Email ou mot de passe incorrect" });
            }

            return user.comparePassword(password).then(function (isMatch) {
                if (!isMatch) {
                    return res
                        .status(401)
                        .json({ message: "Email ou mot de passe incorrect" });
                }

                var token = jwt.sign(
                    { id: user._id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "24h" }
                );

                res.json({ token: token });
            });
        })
        .catch(next);
});

module.exports = router;
