const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Catway = require('../models/catway'); 
const Reservation = require('../models/reservation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @route GET /
 * @description Page d'accueil
 */
router.get('/', (req, res) => {
    res.render('home');
});

/**
 * @route GET /login
 * @description Page de connexion
 */
router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', {
        title: 'Connexion',
        user: null
    });
});

/**
 * @route GET /dashboard
 * @description Tableau de bord
 */
router.get('/dashboard', auth, async (req, res) => {
    try {
        // Récupérer les réservations en cours
        const activeReservations = await Reservation.find({
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        })
        .populate('user', 'username email')
        .sort('endDate')
        .limit(10);

        // Statistiques pour les admins
        let stats = null;
        if (req.user.role === 'admin') {
            stats = {
                totalCatways: await Catway.countDocuments(),
                availableCatways: await Catway.countDocuments({ catwayState: 'disponible' }),
                totalReservations: await Reservation.countDocuments(),
                activeReservations: await Reservation.countDocuments({
                    startDate: { $lte: new Date() },
                    endDate: { $gte: new Date() }
                })
            };
        }

        res.render('dashboard/index', {
            title: 'Tableau de bord',
            user: req.user,
            activeReservations,
            stats,
            currentDate: new Date()
        });
    } catch (error) {
        res.status(500).render('error', {
            message: 'Erreur lors du chargement du tableau de bord',
            error
        });
    }
});

/**
 * @route GET /dashboard/catways
 * @description Liste des catways
 */
router.get('/dashboard/catways', auth, async (req, res) => {
    try {
        const catways = await Catway.find().sort('catwayNumber');
        res.render('dashboard/catways/index', {
            title: 'Gestion des catways',
            user: req.user,
            catways
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur', error });
    }
});

/**
 * @route GET /dashboard/catways/create
 * @description Formulaire de création de catway
 */
router.get('/dashboard/catways/create', auth.isAdmin, (req, res) => {
    res.render('dashboard/catways/create', {
        title: 'Nouveau catway',
        user: req.user
    });
});

/**
 * @route GET /dashboard/catways/:id/edit
 * @description Formulaire de modification de catway
 */
router.get('/dashboard/catways/:id/edit', auth.isAdmin, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                message: 'Catway non trouvé',
                error: { status: 404 }
            });
        }
        res.render('dashboard/catways/edit', {
            title: 'Modifier catway',
            user: req.user,
            catway
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur', error });
    }
});

// Liste des utilisateurs (admin seulement)
router.get('/dashboard/users', auth.isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort('username');
        res.render('dashboard/users/index', {
            title: 'Gestion des utilisateurs',
            user: req.user,
            users
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur', error });
    }
});

// Formulaire de création d'utilisateur (admin seulement)
router.get('/dashboard/users/create', auth.isAdmin, (req, res) => {
    res.render('dashboard/users/create', {
        title: 'Nouvel utilisateur',
        user: req.user
    });
});

// Formulaire de modification d'utilisateur (admin seulement)
router.get('/dashboard/users/:email/edit', auth.isAdmin, async (req, res) => {
    try {
        const userToEdit = await User.findOne({ email: req.params.email }, '-password');
        if (!userToEdit) {
            return res.status(404).render('error', {
                message: 'Utilisateur non trouvé',
                error: { status: 404 }
            });
        }
        res.render('dashboard/users/edit', {
            title: 'Modifier utilisateur',
            user: req.user,
            userToEdit
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur', error });
    }
});

/**
 * @route GET /dashboard/reservations
 * @description Liste des réservations
 */
router.get('/dashboard/reservations', auth, async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
        const reservations = await Reservation.find(filter)
            .populate('user', 'username email')
            .sort('-startDate');

        res.render('dashboard/reservations/index', {
            title: 'Gestion des réservations',
            user: req.user,
            reservations
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur', error });
    }
});

/**
 * @route GET /dashboard/reservations/create
 * @description Formulaire de création de réservation
 */
router.get('/dashboard/reservations/create', auth, async (req, res) => {
    try {
        const availableCatways = await Catway.find({ catwayState: 'disponible' });
        res.render('dashboard/reservations/create', {
            title: 'Nouvelle réservation',
            user: req.user,
            catways: availableCatways
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur', error });
    }
});

/**
 * @route GET /dashboard/reservations/:id/edit
 * @description Formulaire de modification de réservation
 */
router.get('/dashboard/reservations/:id/edit', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).render('error', { message: 'Réservation non trouvée' });
        }
        res.render('dashboard/reservations/edit', { reservation });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

/**
 * @route GET /dashboard/reservations/:id
 * @description Détails d'une réservation
 */
router.get('/dashboard/reservations/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('catwayNumber');
            
        if (!reservation) {
            req.flash('error_msg', 'Réservation non trouvée');
            return res.redirect('/dashboard/reservations');
        }

        res.render('dashboard/reservations/details', {
            title: 'Détails de la réservation',
            user: req.user,
            reservation
        });
    } catch (error) {
        req.flash('error_msg', 'Erreur lors du chargement de la réservation');
        res.redirect('/dashboard/reservations');
    }
});

// Détails d'un catway
router.get('/dashboard/catways/:catwayNumber', auth, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.status(404).render('error', { message: 'Catway non trouvé' });
        }

        const reservations = await Reservation.find({ 
            catwayNumber: req.params.catwayNumber 
        }).sort('-startDate');

        res.render('dashboard/catways/details', { catway, reservations });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

// Détails d'un utilisateur
router.get('/dashboard/users/:email', auth.isAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password');
        if (!user) {
            return res.status(404).render('error', { message: 'Utilisateur non trouvé' });
        }
        res.render('dashboard/users/details', { user });
    } catch (error) {
        res.status(500).render('error', { message: error.message });
    }
});

// POST routes pour les catways
router.post('/dashboard/catways', auth.isAdmin, async (req, res) => {
    try {
        const catway = new Catway(req.body);
        await catway.save();
        res.redirect('/dashboard/catways');
    } catch (error) {
        res.render('dashboard/catways/create', {
            error: error.message,
            catway: req.body
        });
    }
});

router.post('/dashboard/catways/:catwayNumber', auth.isAdmin, async (req, res) => {
    try {
        const { catwayState } = req.body;
        await Catway.findOneAndUpdate(
            { catwayNumber: req.params.catwayNumber },
            { catwayState }
        );
        res.redirect('/dashboard/catways');
    } catch (error) {
        res.render('error', { message: error.message });
    }
});

router.post('/dashboard/catways/:catwayNumber/delete', auth.isAdmin, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.catwayNumber });
        if (!catway) {
            return res.render('error', { message: 'Catway non trouvé' });
        }

        // Vérifier s'il y a des réservations en cours
        const hasReservations = await Reservation.exists({
            catwayNumber: req.params.catwayNumber,
            endDate: { $gte: new Date() }
        });

        if (hasReservations) {
            return res.render('error', { 
                message: 'Impossible de supprimer un catway avec des réservations en cours'
            });
        }

        await catway.remove();
        res.redirect('/dashboard/catways');
    } catch (error) {
        res.render('error', { message: error.message });
    }
});

// POST routes pour les réservations
router.post('/dashboard/reservations', auth, async (req, res) => {
    try {
        // Vérifier les dates
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
            throw new Error('La date de début ne peut pas être dans le passé');
        }

        if (endDate <= startDate) {
            throw new Error('La date de fin doit être après la date de début');
        }

        // Vérifier la disponibilité du catway
        const conflictingReservation = await Reservation.findOne({
            catwayNumber: req.body.catwayNumber,
            $or: [
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate }
                }
            ]
        });

        if (conflictingReservation) {
            throw new Error('Ce catway est déjà réservé pour cette période');
        }

        // Vérifier l'état du catway
        const catway = await Catway.findOne({ catwayNumber: req.body.catwayNumber });
        if (!catway || catway.catwayState !== 'disponible') {
            throw new Error('Ce catway n\'est pas disponible');
        }

        const reservation = new Reservation(req.body);
        await reservation.save();
        res.redirect('/dashboard/reservations');
    } catch (error) {
        const catways = await Catway.find({ catwayState: 'disponible' });
        res.render('dashboard/reservations/create', {
            error: error.message,
            catways,
            reservation: req.body
        });
    }
});

router.post('/dashboard/reservations/:id', auth, async (req, res) => {
    try {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
            throw new Error('La date de début ne peut pas être dans le passé');
        }

        if (endDate <= startDate) {
            throw new Error('La date de fin doit être après la date de début');
        }

        // Vérifier les conflits de réservation (sauf avec la réservation actuelle)
        const conflictingReservation = await Reservation.findOne({
            _id: { $ne: req.params.id },
            catwayNumber: req.body.catwayNumber,
            $or: [
                {
                    startDate: { $lte: endDate },
                    endDate: { $gte: startDate }
                }
            ]
        });

        if (conflictingReservation) {
            throw new Error('Ce catway est déjà réservé pour cette période');
        }

        await Reservation.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/dashboard/reservations');
    } catch (error) {
        const reservation = await Reservation.findById(req.params.id);
        res.render('dashboard/reservations/edit', {
            error: error.message,
            reservation: {
                ...reservation.toObject(),
                ...req.body
            }
        });
    }
});

router.post('/dashboard/reservations/:id/delete', auth, async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard/reservations');
    } catch (error) {
        res.render('error', { message: error.message });
    }
});

// POST routes pour les utilisateurs
router.post('/dashboard/users', auth.isAdmin, async (req, res) => {
    try {
        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.render('dashboard/users/create', {
                error: 'Cet email est déjà utilisé',
                user: req.body
            });
        }

        // Vérifier le format du mot de passe
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return res.render('dashboard/users/create', {
                error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre',
                user: req.body
            });
        }

        const user = new User(req.body);
        await user.save();
        res.redirect('/dashboard/users');
    } catch (error) {
        res.render('dashboard/users/create', {
            error: error.message,
            user: req.body
        });
    }
});

router.post('/dashboard/users/:email', auth.isAdmin, async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        } else {
            delete updates.password;
        }
        await User.findOneAndUpdate({ email: req.params.email }, updates);
        res.redirect('/dashboard/users');
    } catch (error) {
        res.render('error', { message: error.message });
    }
});

router.post('/dashboard/users/:email/delete', auth.isAdmin, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user.role === 'admin') {
            throw new Error('Impossible de supprimer un administrateur');
        }
        await User.findOneAndDelete({ email: req.params.email });
        res.redirect('/dashboard/users');
    } catch (error) {
        res.render('error', { message: error.message });
    }
});

/**
 * @route POST /login
 * @description Traitement de la connexion
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.render('home', {
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Créer le token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Stocker le token dans un cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.redirect('/dashboard');
    } catch (error) {
        res.render('home', {
            error: 'Erreur lors de la connexion'
        });
    }
});

/**
 * @route GET /logout
 * @description Déconnexion
 */
router.get('/logout', auth, (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;