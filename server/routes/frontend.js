var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
var User = require('../models/user');
var Catway = require('../models/catway');
var Reservation = require('../models/reservation');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


/**
 * @route GET /
 * @description Page d'accueil
 */
router.get('/', function(req, res) {
    res.render('home');
});


/**
 * @route GET /login
 * @description Page de connexion
 */
router.get('/login', function(req, res) {
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
router.get('/dashboard', auth, function(req, res) {
    var activeReservations;
    
    Reservation.find({
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
    })
        .populate('user', 'username email')
        .sort('endDate')
        .limit(10)
        .then(function(reservations) {
            activeReservations = reservations;
            
            if (req.user.role === 'admin') {
                return Promise.all([
                    Catway.countDocuments(),
                    Catway.countDocuments({ catwayState: 'disponible' }),
                    Reservation.countDocuments(),
                    Reservation.countDocuments({
                        startDate: { $lte: new Date() },
                        endDate: { $gte: new Date() }
                    })
                ]);
            }
            return [null, null, null, null];
        })
        .then(function(counts) {
            var stats = req.user.role === 'admin' ? {
                totalCatways: counts[0],
                availableCatways: counts[1],
                totalReservations: counts[2],
                activeReservations: counts[3]
            } : null;

            res.render('dashboard/index', {
                title: 'Tableau de bord',
                user: req.user,
                stats: stats,
                activeReservations: activeReservations,
                currentDate: new Date()
            });
        })
        .catch(function(error) {
            res.status(500).render('error', {
                message: 'Erreur lors du chargement du tableau de bord',
                error: error
            });
        });
});

/**
 * @route GET /dashboard/catways
 * @description Liste des catways
 */
router.get('/dashboard/catways', auth, function(req, res) {
    Catway.find()
        .sort('catwayNumber')
        .then(function(catways) {
            res.render('dashboard/catways/index', {
                title: 'Gestion des catways',
                user: req.user,
                catways: catways
            });
        })
        .catch(function(error) {
            res.status(500).render('error', { 
                message: 'Erreur serveur', 
                error: error 
            });
        });
});

/**
 * @route GET /dashboard/catways/create
 * @description Formulaire de création de catway
 */
router.get('/dashboard/catways/create', auth.isAdmin, function(req, res) {
    res.render('dashboard/catways/create', {
        title: 'Nouveau catway',
        user: req.user
    });
});


/**
 * @route GET /dashboard/catways/:id/edit
 * @description Formulaire de modification de catway
 */
router.get('/dashboard/catways/:id/edit', auth.isAdmin, function(req, res) {
    Catway.findOne({ catwayNumber: req.params.id })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).render('error', {
                    message: 'Catway non trouvé',
                    error: { status: 404 }
                });
            }
            res.render('dashboard/catways/edit', {
                title: 'Modifier catway',
                user: req.user,
                catway: catway
            });
        })
        .catch(function(error) {
            res.status(500).render('error', { 
                message: 'Erreur serveur', 
                error: error 
            });
        });
});

// Liste des utilisateurs (admin seulement)
router.get('/dashboard/users', auth.isAdmin, function(req, res) {
    User.find({}, '-password')
        .sort('username')
        .then(function(users) {
            res.render('dashboard/users/index', {
                title: 'Gestion des utilisateurs',
                user: req.user,
                users: users
            });
        })
        .catch(function(error) {
            res.status(500).render('error', { 
                message: 'Erreur serveur', 
                error: error 
            });
        });
});

// Formulaire de création d'utilisateur (admin seulement)
router.get('/dashboard/users/create', auth.isAdmin, function(req, res) {
    res.render('dashboard/users/create', {
        title: 'Nouvel utilisateur',
        user: req.user
    });
});


// Formulaire de modification d'utilisateur (admin seulement)
router.get('/dashboard/users/:email/edit', auth.isAdmin, function(req, res) {
    User.findOne({ email: req.params.email }, '-password')
        .then(function(userToEdit) {
            if (!userToEdit) {
                return res.status(404).render('error', {
                    message: 'Utilisateur non trouvé',
                    error: { status: 404 }
                });
            }
            res.render('dashboard/users/edit', {
                title: 'Modifier utilisateur',
                user: req.user,
                userToEdit: userToEdit
            });
        })
        .catch(function(error) {
            res.status(500).render('error', { 
                message: 'Erreur serveur', 
                error: error 
            });
        });
});

/**
 * @route GET /dashboard/reservations
 * @description Liste des réservations
 */
router.get('/dashboard/reservations', auth, function(req, res) {
    var filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    Reservation.find(filter)
        .populate('user', 'username email')
        .sort('-startDate')
        .then(function(reservations) {
            res.render('dashboard/reservations/index', {
                title: 'Gestion des réservations',
                user: req.user,
                reservations: reservations
            });
        })
        .catch(function(error) {
            res.status(500).render('error', { 
                message: 'Erreur serveur', 
                error: error 
            });
        });
});

/**
 * @route GET /dashboard/reservations/create
 * @description Formulaire de création de réservation
 */
router.get('/dashboard/reservations/create', auth, function(req, res) {
    Catway.find({ catwayState: 'disponible' })
        .then(function(availableCatways) {
            res.render('dashboard/reservations/create', {
                title: 'Nouvelle réservation',
                user: req.user,
                catways: availableCatways
            });
        })
        .catch(function(error) {
            res.status(500).render('error', { 
                message: 'Erreur serveur', 
                error: error 
            });
        });
});


/**
 * @route GET /dashboard/reservations/:id/edit
 * @description Formulaire de modification de réservation
 */
router.get('/dashboard/reservations/:id/edit', auth, function(req, res) {
    Reservation.findById(req.params.id)
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).render('error', { 
                    message: 'Réservation non trouvée' 
                });
            }
            res.render('dashboard/reservations/edit', { 
                title: 'Modifier la réservation',
                user: req.user,
                reservation: reservation
            });
        })
        .catch(function(error) {
            res.status(500).render('error', {
                message: 'Erreur serveur',
                error: error 
            });
        });
});

/**
 * @route GET /dashboard/reservations/:id
 * @description Détails d'une réservation
 */
router.get('/dashboard/reservations/:id', auth, function(req, res) {
    Reservation.findById(req.params.id)
        .populate('catwayNumber')
        .then(function(reservation) {
            if (!reservation) {
                return res.status(404).render('error', { message: 'Réservation non trouvée' });
            }
            res.render('dashboard/reservations/details', {
                title: 'Détails de la réservation',
                user: req.user,
                reservation: reservation
            });
        })
        .catch(function(error) {
            res.status(500).render('error', {
                message: 'Erreur serveur',
                error: error
            });
        });
});

// Détails d'un catway
router.get('/dashboard/catways/:catwayNumber', auth, function(req, res) {
    Catway.findOne({ catwayNumber: req.params.catwayNumber })
        .then(function(catway) {
            if (!catway) {
                return res.status(404).render('error', { message: 'Catway non trouvé' });
            }
            return Reservation.find({ catwayNumber: req.params.catwayNumber })
                .sort('-startDate')
                .then(function(reservations) {
                    res.render('dashboard/catways/details', {
                        title: 'Détails du catway',
                        user: req.user,
                        catway: catway,
                        reservations: reservations
                    });
                });
        })
        .catch(function(error) {
            res.status(500).render('error', { message: error.message });
        });
});

// Détails d'un utilisateur
router.get('/dashboard/users/:email', auth.isAdmin, function(req, res) {
    User.findOne({ email: req.params.email })
        .select('-password')
        .then(function(user) {
            if (!user) {
                return res.status(404).render('error', { message: 'Utilisateur non trouvé' });
            }
            res.render('dashboard/users/details', {
                title: 'Détails de l\'utilisateur',
                user: req.user,
                userDetails: user
            });
        })
        .catch(function(error) {
            res.status(500).render('error', { message: error.message });
        });
});

// POST routes pour les catways
router.post('/dashboard/catways', auth.isAdmin, function(req, res) {
    var catway = new Catway(req.body);
    catway.save()
        .then(function() {
            res.redirect('/dashboard/catways');
        })
        .catch(function(error) {
            res.render('dashboard/catways/create', {
                error: error.message,
                catway: req.body
            });
        });
});

router.post('/dashboard/catways/:catwayNumber', auth.isAdmin, function(req, res) {
    Catway.findOneAndUpdate(
        { catwayNumber: req.params.catwayNumber },
        req.body,
        { new: true }
    )
        .then(function() {
            res.redirect('/dashboard/catways');
        })
        .catch(function(error) {
            res.render('dashboard/catways/edit', {
                error: error.message,
                catway: req.body
            });
        });
});

router.post('/dashboard/catways/:catwayNumber/delete', auth.isAdmin, function(req, res) {
    Catway.findOne({ catwayNumber: req.params.catwayNumber })
        .then(function(catway) {
            if (!catway) {
                return res.render('error', { message: 'Catway non trouvé' });
            }
            return Reservation.exists({
                catwayNumber: req.params.catwayNumber,
                endDate: { $gte: new Date() }
            });
        })
        .then(function(hasReservations) {
            if (hasReservations) {
                return res.render('error', { 
                    message: 'Impossible de supprimer un catway avec des réservations en cours'
                });
            }
            return Catway.findOneAndDelete({ catwayNumber: req.params.catwayNumber });
        })
        .then(function() {
            res.redirect('/dashboard/catways');
        })
        .catch(function(error) {
            res.render('error', { message: error.message });
        });
});

// POST routes pour les réservations
router.post('/dashboard/reservations', auth, function(req, res) {
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
        return res.render('dashboard/reservations/create', {
            error: 'La date de début ne peut pas être dans le passé',
            reservation: req.body
        });
    }

    if (endDate <= startDate) {
        return res.render('dashboard/reservations/create', {
            error: 'La date de fin doit être après la date de début',
            reservation: req.body
        });
    }

    Reservation.findOne({
        catwayNumber: req.body.catwayNumber,
        $or: [
            {
                startDate: { $lte: endDate },
                endDate: { $gte: startDate }
            }
        ]
    })
        .then(function(conflictingReservation) {
            if (conflictingReservation) {
                throw new Error('Ce catway est déjà réservé pour cette période');
            }
            return Catway.findOne({ catwayNumber: req.body.catwayNumber });
        })
        .then(function(catway) {
            if (!catway || catway.catwayState !== 'disponible') {
                throw new Error('Ce catway n\'est pas disponible');
            }
            var reservation = new Reservation(req.body);
            return reservation.save();
        })
        .then(function() {
            res.redirect('/dashboard/reservations');
        })
        .catch(function(error) {
            Catway.find({ catwayState: 'disponible' })
                .then(function(catways) {
                    res.render('dashboard/reservations/create', {
                        error: error.message,
                        catways: catways,
                        reservation: req.body
                    });
                });
        });
});

router.post('/dashboard/reservations/:id', auth, function(req, res) {
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
        return res.render('dashboard/reservations/edit', {
            error: 'La date de début ne peut pas être dans le passé',
            reservation: req.body
        });
    }

    if (endDate <= startDate) {
        return res.render('dashboard/reservations/edit', {
            error: 'La date de fin doit être après la date de début',
            reservation: req.body
        });
    }

    Reservation.findOne({
        _id: { $ne: req.params.id },
        catwayNumber: req.body.catwayNumber,
        $or: [{
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        }]
    })
        .then(function(conflictingReservation) {
            if (conflictingReservation) {
                throw new Error('Ce catway est déjà réservé pour cette période');
            }
            return Reservation.findByIdAndUpdate(req.params.id, req.body);
        })
        .then(function() {
            res.redirect('/dashboard/reservations');
        })
        .catch(function(error) {
            Reservation.findById(req.params.id)
                .then(function(reservation) {
                    res.render('dashboard/reservations/edit', {
                        error: error.message,
                        reservation: reservation
                    });
                });
        });
});

// Une seule route de suppression
router.post('/dashboard/reservations/:id/delete', auth, function(req, res) {
    Reservation.findByIdAndDelete(req.params.id)
        .then(function() {
            res.redirect('/dashboard/reservations');
        })
        .catch(function(error) {
            res.render('error', { message: error.message });
        });
});

// POST routes pour les utilisateurs
router.post('/dashboard/users', auth.isAdmin, function(req, res) {
    User.findOne({ email: req.body.email })
        .then(function(existingUser) {
            if (existingUser) {
                return res.render('dashboard/users/create', {
                    error: 'Cet email est déjà utilisé',
                    user: req.body
                });
            }

            var passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(req.body.password)) {
                return res.render('dashboard/users/create', {
                    error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre',
                    user: req.body
                });
            }

            return bcrypt.hash(req.body.password, 10);
        })
        .then(function(hashedPassword) {
            var user = new User(req.body);
            user.password = hashedPassword;
            return user.save();
        })
        .then(function() {
            res.redirect('/dashboard/users');
        })
        .catch(function(error) {
            res.render('dashboard/users/create', {
                error: error.message,
                user: req.body
            });
        });
});

router.post('/dashboard/users/:email', auth.isAdmin, function(req, res) {
    var updates = req.body;
    
    (updates.password ? bcrypt.hash(updates.password, 10) : Promise.resolve(null))
        .then(function(hashedPassword) {
            if (hashedPassword) {
                updates.password = hashedPassword;
            } else {
                delete updates.password;
            }
            return User.findOneAndUpdate({ email: req.params.email }, updates);
        })
        .then(function() {
            res.redirect('/dashboard/users');
        })
        .catch(function(error) {
            res.render('error', { message: error.message });
        });
});

router.post('/dashboard/users/:email/delete', auth.isAdmin, function(req, res) {
    User.findOne({ email: req.params.email })
        .then(function(user) {
            if (!user) {
                throw new Error('Utilisateur non trouvé');
            }
            if (user.role === 'admin') {
                throw new Error('Impossible de supprimer un administrateur');
            }
            return User.findOneAndDelete({ email: req.params.email });
        })
        .then(function() {
            res.redirect('/dashboard/users');
        })
        .catch(function(error) {
            res.render('error', { message: error.message });
        });
});

/**
 * @route POST /login
 * @description Traitement de la connexion
 */
router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email: email })
        .then(function(user) {
            if (!user) {
                return res.render('home', {
                    error: 'Email ou mot de passe incorrect'
                });
            }

            return user.comparePassword(password)
                .then(function(isMatch) {
                    if (!isMatch) {
                        return res.render('home', {
                            error: 'Email ou mot de passe incorrect'
                        });
                    }

                    var token = jwt.sign(
                        { id: user._id, role: user.role },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production'
                    });

                    res.redirect('/dashboard');
                });
        })
        .catch(function(error) {
            res.render('home', {
                error: 'Erreur lors de la connexion'
            });
        });
});

/**
 * @route GET /logout
 * @description Déconnexion
 */
router.get('/logout', auth, function(req, res) {
    res.clearCookie('token');
    res.redirect('/');
});


module.exports = router;