const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');

console.log('MongoDB URI dans authController:', process.env.MONGODB_URI);

// Inscription
const register = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: 'Cet email est déjà utilisé'
        });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await User.create({
        email,
        password: hashedPassword,
        username
    });

    res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
            id: user._id,
            email: user.email,
            username: user.username
        }
    });
});

// Connexion
const login = async (req, res) => {
    try {
        console.log('\n=== Tentative de connexion ===');
        console.log('📧 Email:', req.body.email);
        
        // Vérifier que l'email est en minuscules
        const email = req.body.email.toLowerCase();
        
        // Log de la requête MongoDB
        console.log('🔍 Recherche utilisateur avec email:', email);
        console.log('📦 Collection:', User.collection.name);
        console.log('🗄️ Base de données:', User.db.name);
        
        // Vérifier l'email
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ Utilisateur non trouvé');
            
            // Lister tous les utilisateurs pour debug
            const allUsers = await User.find({});
            console.log('\n📋 Liste des utilisateurs dans la base:');
            allUsers.forEach(u => {
                console.log(`- ${u.email} (${u.role})`);
            });
            
            return res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect'
            });
        }

        console.log('✅ Utilisateur trouvé:', {
            id: user._id,
            email: user.email,
            role: user.role
        });

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(req.body.password);
        console.log('🔑 Mot de passe valide:', isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('🎟️ Token généré');
        console.log('=== Fin de la connexion ===\n');

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('❌ Erreur login:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la connexion'
        });
    }
};

// Déconnexion
const logout = (req, res) => {
    res.json({
        success: true,
        message: 'Déconnexion réussie'
    });
};

// Obtenir l'utilisateur courant
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'utilisateur'
        });
    }
};

// Changer le mot de passe
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        // Vérifier le mot de passe actuel
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mot de passe actuel incorrect'
            });
        }

        // Hasher et sauvegarder le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({
            success: true,
            message: 'Mot de passe modifié avec succès'
        });
    } catch (error) {
        console.error('❌ Erreur lors du changement de mot de passe:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de mot de passe'
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    changePassword
}; 