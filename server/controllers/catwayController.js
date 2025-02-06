const Catway = require("../models/catway");
const Reservation = require("../models/reservation");

// Debug: vérifions ce qui est exporté
const controller = {
    // GET /catways
    getAllCatways: async (req, res) => {
        try {
            console.log("Récupération des catways");
            console.log("Utilisateur:", req.user.email);
            
            const catways = await Catway.find().sort({ catwayNumber: 1 });
            console.log("Nombre de catways trouvés:", catways.length);
            
            res.json({
                success: true,
                data: catways
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des catways:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des catways",
                error: error.message
            });
        }
    },

    // GET /catways/:id
    getCatway: async (req, res) => {
        try {
            const catway = await Catway.findOne({ catwayNumber: req.params.id });
            if (!catway) {
                return res.status(404).json({
                    success: false,
                    message: "Catway non trouvé"
                });
            }
            res.json({
                success: true,
                data: catway
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération du catway",
                error: error.message
            });
        }
    },

    // GET /catways/:catwayId/reservations
    getReservationsByCatway: async (req, res) => {
        try {
            const reservations = await Reservation.find({
                catwayNumber: req.params.catwayId
            });
            res.json({
                success: true,
                data: reservations
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des réservations",
                error: error.message
            });
        }
    },

    // POST /catways/:catwayId/reservations
    createReservation: async (req, res) => {
        try {
            const reservation = new Reservation({
                catwayNumber: req.params.catwayId,
                ...req.body
            });
            await reservation.save();
            res.status(201).json({
                success: true,
                data: reservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la création de la réservation",
                error: error.message
            });
        }
    },

    // PUT /catways/:catwayId/reservations/:reservationId
    updateReservation: async (req, res) => {
        try {
            const reservation = await Reservation.findByIdAndUpdate(
                req.params.reservationId,
                req.body,
                { new: true }
            );
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    message: "Réservation non trouvée"
                });
            }
            res.json({
                success: true,
                data: reservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la mise à jour de la réservation",
                error: error.message
            });
        }
    },

    // DELETE /catways/:catwayId/reservations/:reservationId
    deleteReservation: async (req, res) => {
        try {
            const reservation = await Reservation.findByIdAndDelete(req.params.reservationId);
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    message: "Réservation non trouvée"
                });
            }
            res.json({
                success: true,
                data: reservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la suppression de la réservation",
                error: error.message
            });
        }
    },

    // POST /catways
    createCatway: async (req, res) => {
        try {
            const catway = new Catway(req.body);
            await catway.save();
            res.status(201).json({
                success: true,
                data: catway
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la création du catway",
                error: error.message
            });
        }
    },

    // PUT /catways/:id
    updateCatway: async (req, res) => {
        try {
            const catway = await Catway.findOneAndUpdate(
                { catwayNumber: req.params.id },
                { $set: req.body },
                { new: true }
            );
            if (!catway) {
                return res.status(404).json({
                    success: false,
                    message: "Catway non trouvé"
                });
            }
            res.json({
                success: true,
                data: catway
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la mise à jour du catway",
                error: error.message
            });
        }
    },

    // DELETE /catways/:id
    deleteCatway: async (req, res) => {
        try {
            const catway = await Catway.findOneAndDelete({
                catwayNumber: req.params.id
            });
            if (!catway) {
                return res.status(404).json({
                    success: false,
                    message: "Catway non trouvé"
                });
            }
            res.json({
                success: true,
                data: catway
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Erreur lors de la suppression du catway",
                error: error.message
            });
        }
    }
};

// Debug: vérifions ce qui est exporté
console.log("Fonctions exportées:", Object.keys(controller));

module.exports = controller;
