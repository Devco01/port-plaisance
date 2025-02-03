const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const frontendRoutes = require('./routes/frontend');

const app = express();

// Configuration de la base de données
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connexion à MongoDB réussie');
}).catch(err => {
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
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Port de Plaisance Russell - Documentation",
    customfavIcon: "/images/favicon.ico"
}));

// Routes API
app.use('/login', authRoutes);
app.use('/logout', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);

// Routes Frontend
app.use('/', frontendRoutes);

// Page d'accueil
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Port de Plaisance Russell',
        description: 'Système de gestion des réservations de catways'
    });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Page non trouvée',
        error: { status: 404 }
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
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
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

module.exports = app; 