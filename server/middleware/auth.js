var jwt = require('jsonwebtoken');
var User = require('../models/user');

/**
 * Middleware d'authentification
 * Vérifie le token JWT et ajoute l'utilisateur à la requête
 */
var auth = function(req, res, next) {
    // Récupérer le token
    var token = req.headers.authorization ? 
        req.headers.authorization.split(' ')[1] : 
        (req.cookies.token || req.query.token);

    if (!token) {
        return res.status(401).json({ 
            message: 'Authentification requise' 
        });
    }

    // Vérifier le token
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    message: 'Token invalide' 
                });
            }
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    message: 'Token expiré' 
                });
            }
            return res.status(500).json({ 
                message: 'Erreur d\'authentification' 
            });
        }

        // Récupérer l'utilisateur
        User.findOne({ 
            email: decoded.email,
            active: true 
        })
            .select('-password')
            .then(function(user) {
                if (!user) {
                    return res.status(401).json({ 
                        message: 'Utilisateur non trouvé ou compte désactivé' 
                    });
                }

                // Ajouter l'utilisateur à la requête
                req.user = user;
                req.token = token;

                next();
            })
            .catch(function(error) {
                res.status(500).json({ 
                    message: 'Erreur d\'authentification' 
                });
            });
    });
};

/**
 * Middleware pour vérifier le rôle administrateur
 */
var isAdmin = function(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: 'Accès réservé aux administrateurs' 
        });
    }
    next();
};

/**
 * Middleware pour vérifier que l'utilisateur est propriétaire ou admin
 */
var isOwnerOrAdmin = function(paramName) {
    paramName = paramName || 'email';
    return function(req, res, next) {
        var resourceEmail = req.params[paramName];
        if (req.user.role !== 'admin' && req.user.email !== resourceEmail) {
            return res.status(403).json({ 
                message: 'Accès non autorisé' 
            });
        }
        next();
    };
};

/**
 * Middleware pour la gestion des erreurs d'authentification
 */
var handleAuthError = function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ 
            message: 'Token invalide ou expiré' 
        });
    } else {
        next(err);
    }
};

module.exports = {
    auth: auth,
    isAdmin: isAdmin,
    isOwnerOrAdmin: isOwnerOrAdmin,
    handleAuthError: handleAuthError
}; 