var User = require("../models/user");

/**
 * Liste tous les utilisateurs
 */
exports.getAllUsers = function (req, res) {
    User.find()
        .select("-password")
        .then(function (users) {
            res.json(users);
        })
        .catch(function (error) {
            res.status(500).json({ message: error.message });
        });
};

/**
 * Récupère un utilisateur par son email
 */
exports.getUserByEmail = function (req, res) {
    User.findOne({ email: req.params.email })
        .select("-password")
        .then(function (user) {
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Utilisateur non trouvé" });
            }
            res.json(user);
        })
        .catch(function (error) {
            res.status(500).json({ message: error.message });
        });
};

/**
 * Crée un nouvel utilisateur
 */
exports.createUser = function (req, res) {
    var newUser = new User(req.body);
    newUser
        .save()
        .then(function (user) {
            var userResponse = user.toObject();
            delete userResponse.password;
            res.status(201).json(userResponse);
        })
        .catch(function (error) {
            res.status(400).json({ message: error.message });
        });
};

/**
 * Modifie un utilisateur
 */
exports.updateUser = function (req, res) {
    User.findOneAndUpdate({ email: req.params.email }, req.body, {
        new: true,
        runValidators: true
    })
        .select("-password")
        .then(function (user) {
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Utilisateur non trouvé" });
            }
            res.json(user);
        })
        .catch(function (error) {
            res.status(400).json({ message: error.message });
        });
};

/**
 * Supprime un utilisateur
 */
exports.deleteUser = function (req, res) {
    User.findOneAndDelete({ email: req.params.email })
        .then(function (user) {
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Utilisateur non trouvé" });
            }
            res.json({ message: "Utilisateur supprimé avec succès" });
        })
        .catch(function (error) {
            res.status(500).json({ message: error.message });
        });
};

/**
 * Connexion utilisateur
 */
exports.login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var foundUser;

    User.findOne({ email: email })
        .then(function (user) {
            foundUser = user;
            if (!user || !user.active) {
                return res.status(401).json({
                    message: "Identifiants invalides ou compte désactivé"
                });
            }

            return bcrypt.compare(password, user.password);
        })
        .then(function (isValidPassword) {
            if (!isValidPassword) {
                return res
                    .status(401)
                    .json({ message: "Identifiants invalides" });
            }

            // Mettre à jour la date de dernière connexion
            foundUser.lastLogin = new Date();
            return foundUser.save();
        })
        .then(function (user) {
            // Générer le token JWT
            var token = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            res.json({ token: token });
        })
        .catch(function (error) {
            res.status(500).json({ message: "Erreur lors de la connexion" });
        });
};

/**
 * Déconnexion utilisateur
 */
exports.logout = function (req, res) {
    // La déconnexion est gérée côté client en supprimant le token
    res.json({ message: "Déconnexion réussie" });
};
