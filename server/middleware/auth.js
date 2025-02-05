var jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification
 * Vérifie le token JWT et ajoute l'utilisateur à la requête
 */
var auth = function (req, res, next) {
    try {
        // Récupérer le token du header Authorization ou des cookies
        var token =
            req.cookies.token ||
            (req.headers.authorization &&
                req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ message: "Token non fourni" });
        }

        // Vérifier le token
        var decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "test_secret"
        );

        // Ajouter les informations de l'utilisateur à la requête
        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token invalide" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expiré" });
        }
        next(err);
    }
};

var isAdmin = function (req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Accès refusé" });
        }
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Accès refusé - Droits administrateur requis"
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

var isOwnerOrAdmin = function () {
    return function (req, res, next) {
        if (req.user.role === "admin" || req.user.email === req.params.email) {
            next();
        } else {
            res.status(403).json({ message: "Accès refusé" });
        }
    };
};

var logout = function (req, res) {
    res.clearCookie("token");
    res.json({ message: "Déconnexion réussie" });
};

module.exports = {
    auth: auth,
    isAdmin: isAdmin,
    isOwnerOrAdmin: isOwnerOrAdmin,
    logout: logout
};
