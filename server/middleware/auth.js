const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function(req, res, next) {
    console.log('🔍 Headers reçus:', {
        auth: req.headers.authorization,
        contentType: req.headers['content-type']
    });

    // Récupérer le token du header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    console.log('🔑 Vérification token:', {
        hasToken: !!token,
        secret: config.jwtSecret ? '✅ Défini' : '❌ Non défini'
    });

    if (!token) {
        console.log('❌ Token manquant dans la requête');
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