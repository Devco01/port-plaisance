const Reservation = require('../models/reservation');

// Créer un objet pour stocker toutes nos fonctions
const reservationController = {
  // Obtenir toutes les réservations
  getAllReservations: async (req, res) => {
    try {
      console.log('Début getAllReservations');
      
      // Récupérer toutes les réservations avec les informations des catways
      const reservations = await Reservation.find().populate({
        path: 'catway',
        select: 'catwayNumber catwayType catwayState'
      });
      
      console.log('Nombre de réservations trouvées:', reservations.length);
      console.log('Première réservation (si existe):', 
        reservations.length > 0 ? JSON.stringify(reservations[0], null, 2) : 'Aucune');
      
      // Formater les réservations
      const formattedReservations = reservations.map(res => {
        const resObj = res.toObject();
        console.log('Réservation brute:', resObj);
        
        return {
          _id: resObj._id,
          clientName: resObj.clientName,
          boatName: resObj.boatName,
          startDate: resObj.startDate,
          endDate: resObj.endDate,
          status: resObj.status,
          catway: {
            number: resObj.catway?.catwayNumber?.toString() || 'N/A'
          }
        };
      });
      
      console.log('Nombre de réservations formatées:', formattedReservations.length);
      console.log('Première réservation formatée (si existe):', 
        formattedReservations.length > 0 ? JSON.stringify(formattedReservations[0], null, 2) : 'Aucune');
      
      res.json({
        success: true,
        data: formattedReservations
      });
    } catch (error) {
      console.error('Erreur dans getAllReservations:', error);
      console.error('Stack trace:', error.stack);
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
