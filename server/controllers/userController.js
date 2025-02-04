var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/**
 * Liste tous les utilisateurs
 */
exports.getAllUsers = function(req, res) {
    // Vérifier que l'utilisateur est admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }

    User.find({}, '-password')
        .then(function(users) {
            res.json(users);
        })
        .catch(function(error) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération des utilisateurs' 
            });
        });
};

/**
 * Récupère un utilisateur par son email
 */
exports.getUserByEmail = function(req, res) {
    User.findOne({ email: req.params.email }, '-password')
        .then(function(user) {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Vérifier que l'utilisateur est admin ou consulte son propre profil
            if (req.user.role !== 'admin' && req.user.email !== user.email) {
                return res.status(403).json({ message: 'Accès non autorisé' });
            }

            res.json(user);
        })
        .catch(function(error) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération de l\'utilisateur' 
            });
        });
};

/**
 * Crée un nouvel utilisateur
 */
exports.createUser = function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role || 'user';

    User.findOne({ email: email })
        .then(function(existingUser) {
            if (existingUser) {
                return res.status(409).json({ message: 'Cet email est déjà utilisé' });
            }

            return bcrypt.hash(password, 10);
        })
        .then(function(hashedPassword) {
            var user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                role: role,
                active: true
            });

            return user.save();
        })
        .then(function() {
            res.status(201).json({ message: 'Utilisateur créé avec succès' });
        })
        .catch(function(error) {
            res.status(400).json({ 
                message: 'Erreur lors de la création de l\'utilisateur' 
            });
        });
};

/**
 * Modifie un utilisateur
 */
exports.updateUser = function(req, res) {
    User.findOne({ email: req.params.email })
        .then(function(user) {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Vérifier que l'utilisateur est admin ou modifie son propre profil
            if (req.user.role !== 'admin' && req.user.email !== user.email) {
                return res.status(403).json({ message: 'Accès non autorisé' });
            }

            var updates = req.body;
            delete updates.email; // L'email ne peut pas être modifié

            // Empêcher la modification du rôle sauf pour les admins
            if (req.user.role !== 'admin') {
                delete updates.role;
            }

            // Si un nouveau mot de passe est fourni, le hasher
            if (updates.password) {
                return bcrypt.hash(updates.password, 10)
                    .then(function(hashedPassword) {
                        updates.password = hashedPassword;
                        return User.updateOne(
                            { email: req.params.email }, 
                            { $set: updates }
                        );
                    });
            }

            return User.updateOne(
                { email: req.params.email }, 
                { $set: updates }
            );
        })
        .then(function() {
            res.json({ message: 'Utilisateur modifié avec succès' });
        })
        .catch(function(error) {
            res.status(400).json({ 
                message: 'Erreur lors de la modification de l\'utilisateur' 
            });
        });
};

/**
 * Supprime un utilisateur
 */
exports.deleteUser = function(req, res) {
    User.findOne({ email: req.params.email })
        .then(function(user) {
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Vérifier que l'utilisateur est admin et ne supprime pas son propre compte
            if (req.user.role !== 'admin' || req.user.email === user.email) {
                return res.status(403).json({ message: 'Action non autorisée' });
            }

            return User.deleteOne({ email: req.params.email });
        })
        .then(function() {
            res.json({ message: 'Utilisateur supprimé avec succès' });
        })
        .catch(function(error) {
            res.status(500).json({ 
                message: 'Erreur lors de la suppression de l\'utilisateur' 
            });
        });
};

/**
 * Connexion utilisateur
 */
exports.login = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var foundUser;

    User.findOne({ email: email })
        .then(function(user) {
            foundUser = user;
            if (!user || !user.active) {
                return res.status(401).json({ 
                    message: 'Identifiants invalides ou compte désactivé' 
                });
            }

            return bcrypt.compare(password, user.password);
        })
        .then(function(isValidPassword) {
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Identifiants invalides' });
            }

            // Mettre à jour la date de dernière connexion
            foundUser.lastLogin = new Date();
            return foundUser.save();
        })
        .then(function(user) {
            // Générer le token JWT
            var token = jwt.sign(
                { userId: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token: token });
        })
        .catch(function(error) {
            res.status(500).json({ message: 'Erreur lors de la connexion' });
        });
};

/**
 * Déconnexion utilisateur
 */
exports.logout = function(req, res) {
    // La déconnexion est gérée côté client en supprimant le token
    res.json({ message: 'Déconnexion réussie' });
};
