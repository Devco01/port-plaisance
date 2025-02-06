const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");

const userController = {
    // Obtenir tous les utilisateurs (admin)
    getUsers: asyncHandler(async (req, res) => {
        const users = await User.find().select("-password");
        res.json({
            success: true,
            data: users
        });
    }),

    // Obtenir un utilisateur par ID (admin)
    getUserById: asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }
        res.json({
            success: true,
            data: user
        });
    }),

    // Obtenir le profil de l'utilisateur connecté
    getCurrentUser: asyncHandler(async (req, res) => {
        const user = await User.findById(req.user.id).select("-password");
        res.json({
            success: true,
            data: user
        });
    }),

    // Créer un utilisateur (admin)
    createUser: asyncHandler(async (req, res) => {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            data: user
        });
    }),

    // Mettre à jour un utilisateur
    updateUser: asyncHandler(async (req, res) => {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.json({
            success: true,
            data: user
        });
    }),

    // Supprimer un utilisateur (admin)
    deleteUser: asyncHandler(async (req, res) => {
        try {
            // Vérifier si c'est le dernier admin
            const adminCount = await User.countDocuments({ role: 'admin' });
            const userToDelete = await User.findOne({ email: req.params.email });

            if (adminCount === 1 && userToDelete?.role === 'admin') {
                return res.status(400).json({
                    success: false,
                    message: "Impossible de supprimer le dernier administrateur"
                });
            }

            const user = await User.findOneAndDelete({ email: req.params.email });
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Utilisateur non trouvé"
                });
            }

            res.json({
                success: true,
                message: "Utilisateur supprimé avec succès"
            });
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la suppression de l'utilisateur",
                error: error.message
            });
        }
    })
};

module.exports = userController;
