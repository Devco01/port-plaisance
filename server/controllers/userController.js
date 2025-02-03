const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Liste tous les utilisateurs
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
};

/**
 * Récupère un utilisateur par son email
 */
exports.getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }, '-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier que l'utilisateur est admin ou consulte son propre profil
        if (req.user.role !== 'admin' && req.user.email !== user.email) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
    }
};

/**
 * Crée un nouvel utilisateur
 */
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            active: true
        });

        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
};

/**
 * Modifie un utilisateur
 */
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier que l'utilisateur est admin ou modifie son propre profil
        if (req.user.role !== 'admin' && req.user.email !== user.email) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const updates = { ...req.body };
        delete updates.email; // L'email ne peut pas être modifié

        // Si un nouveau mot de passe est fourni, le hasher
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        // Empêcher la modification du rôle sauf pour les admins
        if (req.user.role !== 'admin') {
            delete updates.role;
        }

        await User.updateOne({ email: req.params.email }, { $set: updates });
        res.json({ message: 'Utilisateur modifié avec succès' });
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la modification de l\'utilisateur' });
    }
};

/**
 * Supprime un utilisateur
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier que l'utilisateur est admin et ne supprime pas son propre compte
        if (req.user.role !== 'admin' || req.user.email === user.email) {
            return res.status(403).json({ message: 'Action non autorisée' });
        }

        await User.deleteOne({ email: req.params.email });
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
};

/**
 * Connexion utilisateur
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.active) {
            return res.status(401).json({ message: 'Identifiants invalides ou compte désactivé' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Mettre à jour la date de dernière connexion
        user.lastLogin = new Date();
        await user.save();

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

/**
 * Déconnexion utilisateur
 */
exports.logout = async (req, res) => {
    try {
        // La déconnexion est gérée côté client en supprimant le token
        res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
}; 