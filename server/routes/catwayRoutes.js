<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const auth = require('../middleware/auth');
const Reservation = require('../models/reservation');
const catwayController = require('../controllers/catwayController');

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways et leurs réservations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Catway:
 *       type: object
 *       required:
 *         - catwayNumber
 *         - catwayType
 *         - catwayState
 *       properties:
 *         catwayNumber:
 *           type: string
 *           description: Numéro unique du catway
 *         catwayType:
 *           type: string
 *           enum: [long, short]
 *           description: Type du catway (long ou court)
 *         catwayState:
 *           type: string
 *           description: Description de l'état de la passerelle
 */

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Liste l'ensemble des catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Catway'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', catwayController.getCatways);

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   get:
 *     summary: Récupère les détails d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du catway récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       404:
 *         description: Catway non trouvé
 */
router.get('/:catwayNumber', auth.requireAuth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        res.json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Crée un nouveau catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Catway'
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       400:
 *         description: Données invalides
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', auth.requireAuth, async (req, res) => {
    try {
        // Vérifier si le numéro existe déjà
        const existingCatway = await Catway.findOne({ catwayNumber: req.body.catwayNumber });
        if (existingCatway) {
            return res.status(400).json({ message: 'Ce numéro de catway existe déjà' });
        }

        // Vérifier le type
        if (!['long', 'short'].includes(req.body.catwayType)) {
            return res.status(400).json({ message: 'Type de catway invalide' });
        }

        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   put:
 *     summary: Modifie uniquement l'état d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayState
 *             properties:
 *               catwayState:
 *                 type: string
 *                 description: Nouvel état du catway
 *     responses:
 *       200:
 *         description: État du catway modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catway'
 *       400:
 *         description: Données invalides ou tentative de modification du type
 *       404:
 *         description: Catway non trouvé
 */
router.put('/:catwayNumber', auth.requireAuth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        // Seul l'état peut être modifié
        if (req.body.catwayNumber || req.body.catwayType) {
            return res.status(400).json({ message: 'Seul l\'état peut être modifié' });
        }

        catway.catwayState = req.body.catwayState;
        await catway.save();
        res.json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Catway supprimé avec succès
 *       404:
 *         description: Catway non trouvé
 */
router.delete('/:catwayNumber', auth.requireAuth, async (req, res) => {
    try {
        // Vérifier les réservations en cours
        const hasReservations = await Reservation.exists({
            catwayNumber: req.params.catwayNumber,
            endDate: { $gte: new Date() }
        });

        if (hasReservations) {
            return res.status(400).json({ 
                message: 'Impossible de supprimer un catway avec des réservations en cours' 
            });
        }

        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }
        res.json({ message: 'Catway supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}/reservations:
 *   get:
 *     summary: Liste toutes les réservations d'un catway
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/:catwayNumber/reservations', auth.requireAuth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservations = await Reservation.find({ catwayNumber: req.params.catwayNumber })
            .sort('-startDate');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}/reservations/{idReservation}:
 *   get:
 *     summary: Récupère les détails d'une réservation spécifique
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de la réservation récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Réservation ou catway non trouvé
 */
router.get('/:catwayNumber/reservations/:idReservation', auth.requireAuth, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayNumber: req.params.catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation pour un catway
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Nom du client
 *               boatName:
 *                 type: string
 *                 description: Nom du bateau
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début de la réservation
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de la réservation
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Données invalides ou dates indisponibles
 *       404:
 *         description: Catway non trouvé
 */
router.post('/:catwayNumber/reservations', auth.requireAuth, async (req, res) => {
    try {
        const reservation = new Reservation({
            ...req.body,
            catwayNumber: req.params.catwayNumber
        });

        const newReservation = await reservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}/reservations/{idReservation}:
 *   put:
 *     summary: Modifie une réservation existante
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Nom du client
 *               boatName:
 *                 type: string
 *                 description: Nom du bateau
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début de la réservation
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de la réservation
 *     responses:
 *       200:
 *         description: Réservation modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Données invalides ou dates indisponibles
 *       404:
 *         description: Réservation ou catway non trouvé
 */
router.put('/:catwayNumber/reservations/:idReservation', auth.requireAuth, async (req, res) => {
    try {
        const reservation = await Reservation.findOneAndUpdate(
            {
                _id: req.params.idReservation,
                catwayNumber: req.params.catwayNumber
            },
            req.body,
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{catwayNumber}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Catways, Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Numéro du catway
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Réservation supprimée avec succès
 *       404:
 *         description: Réservation ou catway non trouvé
 */
router.delete('/:catwayNumber/reservations/:idReservation', auth.requireAuth, async (req, res) => {
    try {
        const reservation = await Reservation.findOneAndDelete({
            _id: req.params.idReservation,
            catwayNumber: req.params.catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


=======
const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Reservation = require('../models/reservation');
const config = require('../config/config');

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Catway:
 *       type: object
 *       required:
 *         - catwayNumber
 *         - catwayType
 *         - catwayState
 *       properties:
 *         catwayNumber:
 *           type: string
 *           description: Numéro unique du catway
 *         catwayType:
 *           type: string
 *           enum: [long, short]
 *           description: Type de catway (long ou court)
 *         catwayState:
 *           type: string
 *           description: État actuel du catway
 */

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways récupérée avec succès
 */
router.get('/', auth, async (req, res) => {
    try {
        const catways = await Catway.find();
        return res
            .status(200)
            .set('Content-Type', 'application/json')
            .json(catways);
    } catch (error) {
        console.error('Erreur récupération catways:', error);
        return res
            .status(500)
            .set('Content-Type', 'application/json')
            .json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Créer un nouveau catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayNumber
 *               - catwayType
 *               - catwayState
 *             properties:
 *               catwayNumber:
 *                 type: string
 *               catwayType:
 *                 type: string
 *                 enum: [long, short]
 *               catwayState:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', [auth, isAdmin], async (req, res) => {
    try {
        console.log('Tentative de création de catway:', req.body);
        const { catwayNumber, catwayType, catwayState } = req.body;
        const catway = new Catway({
            catwayNumber,
            catwayType,
            catwayState
        });
        console.log('Catway créé:', catway);
        await catway.save();
        console.log('Catway sauvegardé avec succès');
        return res
            .status(201)
            .set('Content-Type', 'application/json')
            .json(catway);
    } catch (error) {
        console.error('Erreur lors de la création du catway:', error);
        return res
            .status(500)
            .set('Content-Type', 'application/json')
            .json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Récupérer les détails d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *   put:
 *     summary: Modifier l'état d'un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayState
 *             properties:
 *               catwayState:
 *                 type: string
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', [auth, isAdmin], async (req, res) => {
    try {
        // Ne permettre que la modification de l'état
        const { catwayState } = req.body;
        if (!catwayState) {
            return res.status(400).json({ 
                message: 'Seul l\'état du catway peut être modifié' 
            });
        }

        const catway = await Catway.findByIdAndUpdate(
            req.params.id,
            { catwayState },
            { new: true }
        );

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        res.json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', [auth, isAdmin], async (req, res) => {
    try {
        // Vérifier si le catway existe
        const catway = await Catway.findById(req.params.id);
        if (!catway) {
            return res
                .status(404)
                .json({ message: 'Catway non trouvé' });
        }

        // Vérifier s'il y a des réservations associées
        const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber });
        if (reservations.length > 0) {
            return res
                .status(400)
                .set('Content-Type', 'application/json')
                .json({ 
                    success: false,
                    message: 'Impossible de supprimer ce catway car il a des réservations associées'
                });
        }

        // Supprimer le catway
        await Catway.deleteOne({ _id: req.params.id });
        
        return res
            .status(200)
            .json({ message: 'Catway supprimé avec succès' });

    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        return res
            .status(500)
            .set('Content-Type', 'application/json')
            .json({
                success: false,
                message: 'Erreur serveur lors de la suppression',
                error: error.message
            });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Liste toutes les réservations d'un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id/reservations', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservations = await Reservation.find({ catwayNumber: req.params.id })
            .sort({ startDate: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 */
router.post('/catways/:id/reservations', auth, async (req, res) => {
    try {
        console.log('Création réservation - ID catway:', req.params.id);
        console.log('Données reçues:', req.body);
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        console.log('Catway trouvé:', catway);
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservation = new Reservation({
            catwayNumber: req.params.id,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });
        console.log('Réservation à créer:', reservation);
        await reservation.save();
        console.log('Réservation créée avec succès');
        res.status(201).json(reservation);
    } catch (error) {
        console.error('Erreur création réservation:', error);
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Modifier une réservation
 */
router.put('/catways/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservation = await Reservation.findOneAndUpdate(
            {
                _id: req.params.idReservation,
                catwayNumber: req.params.id
            },
            req.body,
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation
 */
router.delete('/catways/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservation = await Reservation.findOneAndDelete({
            _id: req.params.idReservation,
            catwayNumber: req.params.id
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation spécifique
 */
router.get('/catways/:id/reservations/:idReservation', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        const reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayNumber: req.params.id
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


>>>>>>> 9e1db78a25cb06c03b52345848bd5bfc84fe2764
