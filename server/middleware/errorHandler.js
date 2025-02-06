﻿const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err.message || err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Cette entrée existe déjà'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur'
  });
};

module.exports = errorHandler;
