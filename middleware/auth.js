const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Récupérer le token du header
    const token = req.header('x-auth-token');

    // Vérifier si le token existe
    if (!token) {
        return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
    }

    try {
        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_clé_secrète');
        
        // Ajouter l'utilisateur à la requête
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token invalide' });
    }
};

module.exports = auth; 