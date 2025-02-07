const bcrypt = require('bcryptjs');
const User = require('../models/user');
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
    console.log('Login attempt:', req.body);
    try {
        const { email, password } = req.body;
        
        console.log('Checking user:', email);
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found');
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        
        console.log('Checking password');
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            console.log('Password incorrect');
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        
        console.log('Login successful');
        // Générer le token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
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
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion',
            error: error.message
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