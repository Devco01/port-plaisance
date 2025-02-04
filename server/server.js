require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? 
        '/opt/render/project/src/.env' : 
        require('path').resolve(__dirname, '../.env')
});

// Vérification des variables d'environnement requises
var _requiredEnvVars = ['JWT_SECRET', 'PORT'];
if (!process.env.MONGODB_URI && !process.env.MONGODB_URL) {
    console.error('❌ Ni MONGODB_URI ni MONGODB_URL ne sont définis');
    process.exit(1);
}


// Log des variables d'environnement au démarrage
console.log('Variables d\'environnement:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB: process.env.MONGODB_URL ? 
        ' Défini via MONGODB_URL' : 
        process.env.MONGODB_URI ? 
            ' Défini via MONGODB_URI' : 
            ' Non défini',




    MONGODB_URL: process.env.MONGODB_URL,       
    ENV_FILE: require('path').resolve(process.cwd(), '.env')
});

var express = require('express');
var _cors = require('cors');
var swaggerUi = require('swagger-ui-express');
var swaggerSpec = require('./config/swagger');
var connectDB = require('./config/db');
var checkAndCreateAdmin = require('./scripts/checkAdmin').checkAndCreateAdmin;
var path = require('path');


// Importer les routes
console.log('Chargement des routes utilisateurs...');
var userRoutes = require('./routes/userRoutes');
var catwayRoutes = require('./routes/catwayRoutes');
console.log('Routes utilisateurs chargées');


var app = express();

// Middleware CORS en premier

var _corsOptions = {
    origin: function (origin, callback) {
        console.log('🌐 Requête CORS de:', origin);

        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
};

// Parser JSON
app.use(express.json());

// Documentation API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Port de Plaisance - Documentation'
}));

// Routes API (avant les fichiers statiques)
app.use('/api', [
    userRoutes,  // /api/login, /api/users, etc.
    catwayRoutes // /api/catways, etc.
]);

// Servir les fichiers statiques React
app.use(express.static(path.join(__dirname, '../client/build')));

// Route catch-all pour React
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Gestion globale des erreurs
app.use(function(err, req, res, next) {
    console.error('Erreur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
});


// Connexion à MongoDB d'abord
connectDB().then(function() {
    // Vérifier/créer le compte admin
    return checkAndCreateAdmin();
}).then(function() {

    // Toujours utiliser le port fourni par l'environnement en priorité
    var port = process.env.PORT;
    console.log('📌 Port demandé:', port);
    app.listen(port, '0.0.0.0', function() {

        console.log('🌍 Environnement:', process.env.NODE_ENV);
        console.log('🚀 Serveur démarré sur le port ' + port);
        if (process.env.NODE_ENV === 'production') {
            console.log('📝 Documentation API:', 'https://port-plaisance.onrender.com/api-docs');
        }

    });
}).catch(function(err) {
    console.error('Impossible de démarrer le serveur:', err);
    process.exit(1);
});

