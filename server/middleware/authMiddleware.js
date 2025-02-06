const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");


// Middleware de protection des routes
const protect = async (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        console.log("Header d'autorisation:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("❌ Pas de token Bearer");
            return res.status(401).json({
                success: false,
                message: "Accès non autorisé - Token manquant"
            });
        }

        // Extraire le token
        const token = authHeader.split(" ")[1];
        console.log("Token reçu:", token ? "présent" : "manquant");

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token décodé:", { userId: decoded.id, role: decoded.role });

        // Récupérer l'utilisateur
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("❌ Utilisateur non trouvé avec le token");
            return res.status(401).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        // Ajouter l'utilisateur à la requête
        req.user = user;
        console.log("✅ Utilisateur authentifié:", user.email);
        next();
    } catch (error) {
        console.error("❌ Erreur d'authentification:", error);
        res.status(401).json({
            success: false,
            message: "Token invalide ou expiré"
        });
    }
};


// Middleware pour vérifier le rôle admin
const admin = (req, res, next) => {
    console.log("=== Vérification des droits admin ===");
    console.log("Utilisateur:", req.user);
    console.log("Rôle:", req.user?.role);

    if (req.user && req.user.role === "admin") {
        console.log("Accès admin autorisé");
        next();
    } else {
        console.log("Accès admin refusé");
        return res.status(403).json({
            success: false,
            message: "Non autorisé, accès réservé aux administrateurs"
        });
    }
};

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];


        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: "Token d'authentification manquant" 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ 
                    success: false, 
                    error: "Token invalide" 
                });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Erreur lors de l'authentification" 
        });
    }
};

module.exports = {
    protect,
    admin,
    authenticateToken
}; 