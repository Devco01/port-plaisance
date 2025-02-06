const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  try {
    // Vérifier le token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

module.exports = { protect };
