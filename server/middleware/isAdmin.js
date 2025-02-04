module.exports = function(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        next();
    } catch (err) {
        next(err);
    }
}; 