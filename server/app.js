var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var session = require('express-session');
var swaggerUi = require('swagger-ui-express');
var swaggerSpec = require('./config/swagger');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var compression = require('compression');
require('dotenv').config();


// Routes
var authRoutes = require('./routes/authRoutes');
var userRoutes = require('./routes/userRoutes');
var catwayRoutes = require('./routes/catwayRoutes');
var reservationRoutes = require('./routes/reservationRoutes');
var frontendRoutes = require('./routes/frontend');


var app = express();

// Configuration de la base de données

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(function() {
    console.log('Connexion à MongoDB réussie');
}).catch(function(err) {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
});


// Middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Variables globales pour les vues
app.use(function(req, res, next) {
    res.locals.user = req.session.user || null;
    next();
});


// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Port de Plaisance Russell - Documentation',
    customfavIcon: '/images/favicon.ico'
}));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/reservations', reservationRoutes);

// Routes Frontend
app.use('/', frontendRoutes);

// Page d'accueil
app.get('/', function(req, res) {
    res.render('index', { 
        title: 'Port de Plaisance Russell',
        description: 'Système de gestion des réservations de catways'
    });
});


// Gestion des erreurs 404
app.use(function(req, res, next) {
    res.status(404).render('error', {
        message: 'Page non trouvée',
        error: { status: 404 }
    });
});


// Gestion des erreurs
app.use(function(err, req, res, next) {
    console.error(err.stack);
    

    // Si c'est une erreur d'API, renvoyer du JSON
    if (req.path.startsWith('/api/')) {
        return res.status(err.status || 500).json({
            message: err.message,
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    }

    // Sinon, renvoyer une page d'erreur
    res.status(err.status || 500).render('error', {
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', function(reason, promise) {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


process.on('uncaughtException', function(err) {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});


module.exports = app; 