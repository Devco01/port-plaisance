const Reservation = require("../models/reservation");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");

// Simplification du contrôleur avec uniquement les routes nécessaires
module.exports = {
    // GET /catways/:id/reservations
    getReservationsByCatway: async (req, res) => {
        try {
            console.log("=== Récupération des réservations ===");
            console.log("Catway ID:", req.params.id);
            
            const reservations = await Reservation.find({ 
                catwayNumber: req.params.id 
            }).populate("user", "username email").sort({ startDate: 1 });
            
            console.log("Nombre de réservations trouvées:", reservations.length);
            console.log("Réservations:", JSON.stringify(reservations, null, 2));
            
            res.json({ 
                success: true, 
                data: reservations || [] 
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des réservations:", error);
            res.status(500).json({ 
                success: false, 
                error: error.message || "Erreur lors de la récupération des réservations" 
            });
        }
    },

    // GET /catways/:id/reservations/:idReservation
    getReservationById: async (req, res) => {
        try {
            const reservation = await Reservation.findOne({
                catwayNumber: req.params.id,
                _id: req.params.idReservation
            });
            
            if (!reservation) {
                return res.status(404).json({ 
                    success: false, 
                    error: "Réservation non trouvée"
                });
            }
            
            res.json({ success: true, data: reservation });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // POST /catways/:id/reservations
    createReservation: async (req, res) => {
        try {
            console.log("=== Début création réservation ===");
            console.log("Catway Number:", req.params.id);
            console.log("Corps de la requête:", req.body);

            // Vérifier d'abord s'il y a des réservations existantes qui se chevauchent
            const existingReservations = await Reservation.find({
                catwayNumber: req.params.id,
                $or: [
                    {
                        startDate: { $lt: new Date(req.body.endDate) },
                        endDate: { $gt: new Date(req.body.startDate) }
                    }
                ]
            });

            if (existingReservations.length > 0) {
                console.log("Réservations en conflit trouvées:", existingReservations.map(r => ({
                    id: r._id,
                    startDate: r.startDate,
                    endDate: r.endDate,
                    clientName: r.clientName
                })));
                return res.status(400).json({
                    success: false,
                    error: `Le catway ${req.params.id} est déjà réservé pendant cette période`
                });
            }

            const newReservation = new Reservation({
                catwayNumber: req.params.id,
                clientName: req.body.clientName,
                boatName: req.body.boatName,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate)
            });

            console.log("Nouvelle réservation à sauvegarder:", newReservation);
            const savedReservation = await newReservation.save();
            console.log("Réservation sauvegardée:", savedReservation);

            res.status(201).json({ success: true, data: savedReservation });
        } catch (error) {
            console.error("=== Erreur lors de la création ===");
            console.error("Type d'erreur:", error.name);
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
            
            // Renvoyer une erreur 400 pour les erreurs de validation
            if (error.name === "ValidationError" || error.message.includes("déjà réservé")) {
                return res.status(400).json({ 
                    success: false, 
                    error: error.message 
                });
            }

            
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    },

    // PUT /catways/:id/reservations/:idReservation
    updateReservation: async (req, res) => {
        try {
            const updatedReservation = await Reservation.findOneAndUpdate(
                { 
                    catwayNumber: req.params.id,
                    _id: req.params.idReservation 
                },
                req.body,
                { new: true }
            );

            if (!updatedReservation) {
                return res.status(404).json({ 
                    success: false, 
                    error: "Réservation non trouvée" 
                });
            }

            res.json({ success: true, data: updatedReservation });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // DELETE /catways/:id/reservations/:idReservation
    deleteReservation: async (req, res) => {
        try {
            const deletedReservation = await Reservation.findOneAndDelete({
                catwayNumber: req.params.id,
                _id: req.params.idReservation
            });

            if (!deletedReservation) {
                return res.status(404).json({ 
                    success: false, 
                    error: "Réservation non trouvée"
                });
            }

            res.json({ success: true, data: deletedReservation });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // GET /catways/:id/reservations/current
    getCurrentReservationsByCatway: async (req, res) => {
        try {
            // Créer la date d'aujourd'hui à minuit dans le fuseau horaire local
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            
            console.log("=== Récupération des réservations en cours ===");
            console.log("Date actuelle (ISO):", now.toISOString());
            console.log("Date actuelle (locale):", now.toString());
            console.log("Catway ID:", req.params.id);
            
            // Récupérer toutes les réservations pour ce catway
            const reservations = await Reservation.find({
                catwayNumber: req.params.id
            }).populate("user", "username email");

            // Filtrer les réservations en cours côté serveur
            const currentReservations = reservations.filter(reservation => {
                const startDate = new Date(reservation.startDate);
                const endDate = new Date(reservation.endDate);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                
                console.log(`Vérification réservation ${reservation._id}:`, {
                    startDate: startDate.toISOString(),
                    now: now.toISOString(),
                    endDate: endDate.toISOString(),
                    isActive: startDate <= now && endDate >= now
                });
                
                return startDate <= now && endDate >= now;
            });

            console.log("Réservations en cours trouvées:", currentReservations.map(r => ({
                id: r._id,
                startDate: r.startDate,
                endDate: r.endDate,
                clientName: r.clientName
            })));

            res.json({ 
                success: true, 
                data: currentReservations 
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des réservations en cours:", error);
            res.status(500).json({ 
                success: false, 
                error: "Erreur lors de la récupération des réservations en cours" 
            });
        }
    }
};
