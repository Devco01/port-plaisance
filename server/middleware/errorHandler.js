/**
 * Middleware de gestion globale des erreurs
 * @param {Error} err - L'erreur à traiter
 * @param {Request} req - La requête Express
 * @param {Response} res - La réponse Express
 * @param {Function} next - Fonction suivante dans la chaîne des middlewares
 */
function errorHandler(err, req, res, next) {
    // Log de l'erreur en développement
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Gestion des erreurs de validation Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Erreur de validation',
            details: Object.values(err.errors).map(function (e) {
                return {
                    field: e.path,
                    message: e.message
                };
            })
        });
    }

    // Gestion des erreurs de cast Mongoose (ID invalide)
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            message: 'Format d\'ID invalide',
            field: err.path
        });
    }

    // Gestion des erreurs de duplication MongoDB
    if (err.code === 11000) {
        return res.status(409).json({
            status: 'error',
            message: 'Cette ressource existe déjà',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    // Gestion des erreurs JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'Token invalide ou expiré'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Token expiré'
        });
    }

    // Si c'est une erreur d'API, renvoyer du JSON
    if (req.path.startsWith('/api/')) {
        var response = {
            status: 'error',
            message: err.message || 'Erreur serveur interne'
        };

        // Ajouter les détails en développement
        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }

        return res.status(err.status || 500).json(response);
    }

    // Sinon, renvoyer une page d'erreur
    res.status(err.status || 500).render('error', {
        message: err.message || 'Erreur serveur',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
}

module.exports = errorHandler;
