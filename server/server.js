require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? 
        '/opt/render/project/src/.env' : 
        require('path').resolve(__dirname, '../.env')
});

// Vérification des variables d'environnement requises
const requiredEnvVars = ['JWT_SECRET', 'PORT'];
if (!process.env.MONGODB_URI && !process.env.MONGODB_URL) {
    console.error('❌ Ni MONGODB_URI ni MONGODB_URL ne sont définis');
    process.exit(1);
}

// Log des variables d'environnement au démarrage
console.log('Variables d\'environnement:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 
        `✅ Défini (${process.env.MONGODB_URI})` : 
        '❌ Non défini',
    ENV_FILE: require('path').resolve(process.cwd(), '.env')
});

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Middleware CORS en premier
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Parser JSON ensuite
app.use(express.json());

// Servir les fichiers statiques du build React
app.use(express.static(path.join(__dirname, '../client/build')));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Importer les routes
console.log('Chargement des routes utilisateurs...');
const userRoutes = require('./routes/userRoutes');
console.log('Routes utilisateurs chargées');

const catwayRoutes = require('./routes/catwayRoutes');

// Monter les routes avec le préfixe /api
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);

// Toutes les autres routes non-API renvoient l'app React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Connexion à MongoDB d'abord
connectDB().then(() => {
    app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
        console.log(`Serveur démarré sur le port ${process.env.PORT || 8000}`);
    });
}).catch(err => {
    console.error('Impossible de démarrer le serveur:', err);
    process.exit(1);
});
