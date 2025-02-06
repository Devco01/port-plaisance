const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Middleware d'authentification
 * Vérifie le token JWT et ajoute l'utilisateur à la requête
 */
const auth = async (req, res, next) => {
    try {
        // Vérifier le token
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token manquant"
            });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Trouver l'utilisateur
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        console.error("❌ Erreur d'authentification:", error);
        res.status(401).json({
            success: false,
            message: "Non autorisé"
        });
    }
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Accès réservé aux administrateurs"
        });
    }
};

// Middleware pour vérifier si l'utilisateur est le propriétaire ou admin
const isOwnerOrAdmin = () => (req, res, next) => {
    if (req.user.role === "admin" || req.user.email === req.params.email) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Accès refusé"
        });
    }
};

var logout = function (req, res) {
    res.clearCookie("token");
    res.json({ message: "Déconnexion réussie" });
};

// Export direct du middleware
module.exports = auth;
