const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erreur serveur'
  });
};

module.exports = errorHandler;
