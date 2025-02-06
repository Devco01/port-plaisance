const Reservation = require('../models/reservation');

// Créer un objet pour stocker toutes nos fonctions
const reservationController = {
  // Obtenir toutes les réservations
  getAllReservations: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
      }

      const query = req.user.role === 'admin' ? {} : { user: req.user._id };
      console.log('Query:', query);
      console.log('User:', req.user);

      const reservations = await Reservation.find(query)
        .populate({
          path: 'user',
          select: 'username email -_id'
        })
        .sort({ startDate: -1 }); // Tri par date de début décroissante
      
      const formattedReservations = reservations.map(reservation => ({
        _id: reservation._id,
        catwayNumber: reservation.catwayNumber,
        clientName: reservation.clientName,
        boatName: reservation.boatName,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: reservation.status,
        user: reservation.user ? {
          username: reservation.user.username,
          email: reservation.user.email
        } : null
      }));

      res.json({
        success: true,
        data: formattedReservations
      });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des réservations',
        error: error.message
      });
    }
  },

  // Obtenir les réservations d'un catway spécifique
  getCatwayReservations: async (req, res) => {
    try {
      const reservations = await Reservation.find({ catwayNumber: req.params.id });
      res.json({ success: true, data: reservations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Obtenir une réservation spécifique
  getReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findOne({
        catwayNumber: req.params.id,
        _id: req.params.idReservation
      });
      
      if (!reservation) {
        return res.status(404).json({ success: false, error: 'Réservation non trouvée' });
      }
      
      res.json({ success: true, data: reservation });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Obtenir une réservation par ID
  getReservationById: async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }
      res.json({
        success: true,
        data: reservation
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération de la réservation',
        error: error.message
      });
    }
  },

  // Créer une réservation
  createReservation: async (req, res) => {
    try {
      const reservation = await Reservation.create({
        ...req.body,
        user: req.user._id
      });
      res.status(201).json({ success: true, data: reservation });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Modifier une réservation
  updateReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!reservation) {
        return res.status(404).json({ success: false, error: 'Réservation non trouvée' });
      }
      res.json({ success: true, data: reservation });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Supprimer une réservation
  deleteReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findByIdAndDelete(req.params.id);
      if (!reservation) {
        return res.status(404).json({ success: false, error: 'Réservation non trouvée' });
      }
      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Réservations courantes
  getCurrentReservations: async (req, res) => {
    try {
      const currentDate = new Date();
      const reservations = await Reservation.find({
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
      });
      res.json({
        success: true,
        data: reservations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des réservations'
      });
    }
  }
};

// Exporter l'objet controller
module.exports = reservationController;
