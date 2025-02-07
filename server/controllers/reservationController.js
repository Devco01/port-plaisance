const Reservation = require('../models/reservation');

// Créer un objet pour stocker toutes nos fonctions
const reservationController = {
  // Obtenir toutes les réservations
  getAllReservations: async (req, res) => {
    try {
      console.log('Début getAllReservations');
      
      console.log('=== Vérification MongoDB ===');
      const count = await Reservation.countDocuments();
      console.log(`Nombre total de réservations dans MongoDB: ${count}`);
      
      // Vérifier une réservation directement dans MongoDB
      const sampleReservation = await Reservation.findOne();
      console.log('Exemple de réservation dans MongoDB:', 
        JSON.stringify(sampleReservation, null, 2));
      console.log('==========================');
      
      // Récupérer toutes les réservations
      const reservations = await Reservation.find().lean();
      
      console.log('Nombre de réservations trouvées:', reservations.length);
      
      // Formater les réservations selon la structure du fichier JSON
      const formattedReservations = reservations.map(res => ({
        _id: res._id,
        catwayNumber: res.catwayNumber,
        clientName: res.clientName,
        boatName: res.boatName,
        startDate: res.startDate,
        endDate: res.endDate
      }));
      
      res.json({
        success: true,
        data: formattedReservations
      });
    } catch (error) {
      console.error('Erreur dans getAllReservations:', error);
      res.status(500).json({
        success: false,
        message: error.message
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

  // Obtenir une réservation par ID
  getReservationById: async (req, res) => {
    try {
      const reservation = await Reservation.findOne({
        catwayNumber: req.params.id,
        _id: req.params.idReservation
      });
      
      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Réservation non trouvée'
        });
      }
      
      res.json({
        success: true,
        data: reservation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de la réservation'
      });
    }
  },

  // Créer une réservation
  createReservation: async (req, res) => {
    try {
      const newReservation = await Reservation.create({
        ...req.body,
        catwayNumber: req.params.id,
        userId: req.user._id
      });
      
      res.status(201).json({
        success: true,
        data: newReservation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Erreur lors de la création de la réservation'
      });
    }
  },

  // Modifier une réservation
  updateReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findOneAndUpdate(
        {
          catwayNumber: req.params.id,
          _id: req.params.idReservation
        },
        req.body,
        { new: true, runValidators: true }
      );

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Réservation non trouvée'
        });
      }

      res.json({
        success: true,
        data: reservation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Erreur lors de la mise à jour de la réservation'
      });
    }
  },

  // Supprimer une réservation
  deleteReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findOneAndDelete({
        catwayNumber: req.params.id,
        _id: req.params.idReservation
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Réservation non trouvée'
        });
      }

      res.json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression de la réservation'
      });
    }
  },

  // Obtenir les réservations courantes
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
        error: 'Erreur lors de la récupération des réservations courantes'
      });
    }
  },

  getReservationsByCatway: async (req, res) => {
    try {
      const reservations = await Reservation.find({ catwayNumber: req.params.id });
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
