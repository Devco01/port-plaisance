require('dotenv').config();
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
    origin: '*',  // Pour le développement
    credentials: true
}));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Importer les routes
console.log('Chargement des routes utilisateurs...');
const userRoutes = require('./routes/userRoutes');
console.log('Routes utilisateurs chargées');

const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Afficher toutes les routes disponibles de manière détaillée
console.log('\nRoutes disponibles:');
userRoutes.stack.forEach(layer => {
    if (layer.route) {
        console.log(`Route: /api/users${layer.route.path}`);
    }
});

// Monter les routes
console.log('\nMontage des routes...');
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/reservations', reservationRoutes);

// Log des routes montées
console.log('Routes disponibles:');
console.log('/api/users/*');
userRoutes.stack.forEach(r => r.route && console.log('  -', r.route.path));
console.log('/api/reservations/*');
reservationRoutes.stack.forEach(r => r.route && console.log('  -', r.route.path));

// Route de test
app.get('/', (req, res) => {
    res.send('API Port de Plaisance est en ligne');
});

// Route de test globale
app.get('/api/test', (req, res) => {
    res.json({ message: 'API en ligne' });
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

const PORT = process.env.PORT || 8000;
app.listen(config.port, () => {
    console.log(`Serveur démarré sur le port ${config.port}`);
    connectDB();
});
