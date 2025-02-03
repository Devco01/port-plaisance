const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function(req, res, next) {
    // Récupérer le token du header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    console.log('🔑 Vérification token:', {
        hasToken: !!token,
        secret: config.jwtSecret ? '✅ Défini' : '❌ Non défini'
    });

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user;
        console.log('✅ Token vérifié pour:', req.user.email);
        next();
    } catch (err) {
        console.error('❌ Erreur token:', err.message);
        res.status(401).json({ message: 'Token invalide' });
    }
}; 