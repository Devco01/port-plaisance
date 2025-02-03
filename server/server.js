const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const config = require('./config/config');
const connectDB = require('./config/db');

const app = express();

// Parser JSON avant les autres middlewares
app.use(express.json());

// Logger pour les requêtes
app.use((req, res, next) => {
    console.log('Requête reçue:', {
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        body: req.body
    });
    next();
});

// Middleware
app.use(cors({
    origin: '*',  // Pour le développement local
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Access-Control-Allow-Origin']
}));

// Log des requêtes CORS
app.use((req, res, next) => {
    console.log('CORS Headers:', {
        origin: req.headers.origin,
        method: req.method,
        contentType: req.headers['content-type']
    });
    next();
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Importer les routes
console.log('Chargement des routes utilisateurs...');
const userRoutes = require('./routes/userRoutes');
console.log('Routes utilisateurs chargées');

const catwayRoutes = require('./routes/catwayRoutes');

// Afficher toutes les routes disponibles de manière détaillée
console.log('\nRoutes disponibles:');
userRoutes.stack.forEach(layer => {
    if (layer.route) {
        console.log(`Route: /api/users${layer.route.path}`);
    }
});

// Préfixe global pour toutes les routes API
app.use('/api', (req, res, next) => {
    console.log('API Request:', req.method, req.url);
    next();
});

// Monter les routes avec le préfixe /api
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);

// Log des routes montées
console.log('Routes disponibles:');
console.log('/api/users/*');
userRoutes.stack.forEach(r => r.route && console.log('  -', r.route.path));

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'API Port de Plaisance est en ligne' });
});

// Route de test globale
app.get('/api/test', (req, res) => {
    res.json({ message: 'API en ligne' });
});

// Log des requêtes pour le débogage
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Log toutes les requêtes
app.use((req, res, next) => {
    console.log('Nouvelle requête:', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    });
    next();
});

// Gestion des erreurs 404
app.use((req, res) => {
    console.log('Route non trouvée:', req.originalUrl);
    res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${config.port}`);
    connectDB();
});
