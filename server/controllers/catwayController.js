var Catway = require("../models/catway");
var Reservation = require("../models/reservation");

/**
 * Liste tous les catways
 */
module.exports = {
    getAllCatways: function (req, res) {
        var filter = {};
        if (req.query.type) filter.catwayType = req.query.type;
        if (req.query.state) filter.catwayState = req.query.state;

        Catway.find(filter)
            .sort("catwayNumber")
            .then(function (catways) {
                res.json(catways);
            })
            .catch(function (error) {
                res.status(500).json({
                    message: "Erreur lors de la récupération des catways",
                    error: error.message
                });
            });
    },

    /**
     * Récupère un catway par son numéro
     */
    getCatwayById: function (req, res) {
        Catway.findOne({ catwayNumber: req.params.id })
            .then(function (catway) {
                if (!catway) {
                    return res
                        .status(404)
                        .json({ message: "Catway non trouvé" });
                }

                return Reservation.find({
                    catwayNumber: catway.catwayNumber,
                    endDate: { $gte: new Date() }
                })
                    .sort("startDate")
                    .populate("user", "email")
                    .then(function (activeReservations) {
                        var catwayObj = catway.toObject();
                        catwayObj.activeReservations = activeReservations;
                        res.json(catwayObj);
                    });
            })
            .catch(function (error) {
                res.status(500).json({
                    message: "Erreur lors de la récupération du catway",
                    error: error.message
                });
            });
    },

    /**
     * Crée un nouveau catway
     */
    createCatway: function (req, res) {
        var newCatway = new Catway(req.body);
        newCatway
            .save()
            .then(function (catway) {
                res.status(201).json(catway);
            })
            .catch(function (error) {
                if (error.code === 11000) {
                    return res.status(400).json({
                        message: "Ce numéro de catway existe déjà"
                    });
                }
                res.status(400).json({
                    message: "Erreur lors de la création du catway",
                    error: error.message
                });
            });
    },

    /**
     * Modifie l'état d'un catway
     */
    updateCatway: function (req, res) {
        Catway.findOneAndUpdate({ catwayNumber: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
            .then(function (catway) {
                if (!catway) {
                    return res
                        .status(404)
                        .json({ message: "Catway non trouvé" });
                }
                res.json(catway);
            })
            .catch(function (error) {
                res.status(400).json({
                    message: "Erreur lors de la mise à jour du catway",
                    error: error.message
                });
            });
    },

    /**
     * Supprime un catway
     */
    deleteCatway: function (req, res) {
        Catway.findOneAndDelete({ catwayNumber: req.params.id })
            .then(function (catway) {
                if (!catway) {
                    return res
                        .status(404)
                        .json({ message: "Catway non trouvé" });
                }
                res.json({ message: "Catway supprimé avec succès" });
            })
            .catch(function (error) {
                res.status(500).json({
                    message: "Erreur lors de la suppression du catway",
                    error: error.message
                });
            });
    }
};
