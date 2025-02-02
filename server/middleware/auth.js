const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Pas de token, accès refusé' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Format de token invalide' });
    }

    try {
        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, config.jwtSecret);
        
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide' });
    }
}; 