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
    MONGODB: process.env.MONGODB_URL ? 
        `✅ Défini via MONGODB_URL` : 
        (process.env.MONGODB_URI ? 
            `✅ Défini via MONGODB_URI` : 
            '❌ Non défini'),
    MONGODB_URL: process.env.MONGODB_URL,
    ENV_FILE: require('path').resolve(process.cwd(), '.env')
});

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/db');
const checkAndCreateAdmin = require('./scripts/checkAdmin').checkAndCreateAdmin;
const path = require('path');

// Importer les routes
console.log('Chargement des routes utilisateurs...');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
console.log('Routes utilisateurs chargées');

const app = express();

// Middleware CORS en premier
app.use(cors({
    origin: ['https://port-plaisance.onrender.com', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

// Parser JSON ensuite
app.use(express.json());

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);

// Documentation API ensuite
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Port de Plaisance - Documentation"
}));

// Servir les fichiers statiques React
app.use(express.static(path.join(__dirname, '../client/build')));

// Toutes les autres routes non-API renvoient l'app React
app.get('*', (req, res) => {
    console.log('📍 Route demandée:', req.path);
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Connexion à MongoDB d'abord
connectDB().then(() => {
    // Vérifier/créer le compte admin
    return checkAndCreateAdmin();
}).then(() => {
    app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
        console.log(`Serveur démarré sur le port ${process.env.PORT || 8000}`);
    });
}).catch(err => {
    console.error('Impossible de démarrer le serveur:', err);
    process.exit(1);
});
