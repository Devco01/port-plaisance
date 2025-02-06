/**
 * Middleware de gestion globale des erreurs
 * @param {Error} err - L'erreur à traiter
 * @param {Request} req - La requête Express
 * @param {Response} res - La réponse Express
 * @param {Function} next - Fonction suivante dans la chaîne des middlewares
 */
const errorHandler = (err, req, res, next) => {
    console.error("Erreur complète:", err);

    // Si l'erreur vient de Mongoose
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Erreur de validation",
            errors: Object.values(err.errors).map(e => e.message)
        });
    }


    // Si l'erreur vient de MongoDB
    if (err.name === "MongoError" || err.name === "MongoServerError") {
        return res.status(500).json({
            success: false,
            message: "Erreur de base de données",
            error: process.env.NODE_ENV === "development" ? err.message : "Erreur interne"
        });
    }


    // Pour toutes les autres erreurs
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Une erreur est survenue",
        error: process.env.NODE_ENV === "development" ? err : {}
    });
};

module.exports = errorHandler;
