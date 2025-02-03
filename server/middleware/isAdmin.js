const isAdmin = (req, res, next) => {
    // Vérifier si l'utilisateur existe et a le rôle admin
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            message: 'Accès refusé - Droits administrateur requis' 
        });
    }
    next();
};

module.exports = isAdmin; 