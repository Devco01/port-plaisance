const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userController = {
  // Obtenir tous les utilisateurs
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message
      });
    }
  },

  // Obtenir un utilisateur par email
  getUserByEmail: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email }).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'utilisateur',
        error: error.message
      });
    }
  },

  // Créer un utilisateur
  createUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Créer l'utilisateur
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || 'user'
      });

      // Retourner l'utilisateur sans le mot de passe
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message
      });
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const updateData = {};

      if (username) updateData.username = username;
      if (role) updateData.role = role;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findOneAndUpdate(
        { email: req.params.email },
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        error: error.message
      });
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ email: req.params.email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        error: error.message
      });
    }
  }
};

module.exports = userController;
