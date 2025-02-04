var jwt = require('jsonwebtoken');
var User = require('../models/user');

/**
 * Middleware d'authentification
 * Vérifie le token JWT et ajoute l'utilisateur à la requête
 */
var auth = function(req, res, next) {
    var token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[1]) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }

    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
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