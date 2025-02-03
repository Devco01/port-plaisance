const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware d'authentification
 * Vérifie le token JWT et ajoute l'utilisateur à la requête
 */
const auth = async (req, res, next) => {
    try {
        // Récupérer le token
        const token = req.headers.authorization?.split(' ')[1] || 
                     req.cookies?.token ||
                     req.query?.token;

        if (!token) {
            return res.status(401).json({ 
                message: 'Authentification requise' 
            });
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Récupérer l'utilisateur
        const user = await User.findOne({ 
            email: decoded.email,
            active: true 
        }).select('-password');

        if (!user) {
            return res.status(401).json({ 
                message: 'Utilisateur non trouvé ou compte désactivé' 
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Token invalide' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expiré' 
            });
        }
        res.status(500).json({ 
            message: 'Erreur d\'authentification' 
        });
    }
};

/**
 * Middleware pour vérifier le rôle administrateur
 */
const isAdmin = (req, res, next) => {
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
const isOwnerOrAdmin = (paramName = 'email') => {
    return (req, res, next) => {
        const resourceEmail = req.params[paramName];
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
const handleAuthError = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ 
            message: 'Token invalide ou expiré' 
        });
    } else {
        next(err);
    }
};

module.exports = {
    auth,
    isAdmin,
    isOwnerOrAdmin,
    handleAuthError
}; 
}; 