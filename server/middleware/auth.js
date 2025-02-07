const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware de protection des routes
const auth = async (req, res, next) => {
    try {
        console.log('Headers:', req.headers);  // Pour debug
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({
                success: false,
                message: 'Accès non autorisé : token manquant'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Récupérer l'utilisateur complet depuis la base de données
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            // Ajouter l'utilisateur complet à la requête
            req.user = user;
            next();
        } catch (error) {
            console.log('Auth error:', error);
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        }
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'authentification'
        });
    }
};

// Middleware pour vérifier les droits admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Accès refusé - Droits administrateur requis'
        });
    }
};

module.exports = { auth, admin }; 