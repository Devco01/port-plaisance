﻿require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const corsOptions = require('./config/cors');
const initializeAdmin = require('./scripts/initDb');

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Documentation Swagger avec options personnalisées
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Port de Plaisance Russell',
    customfavIcon: '/favicon.ico',  // Le chemin est relatif au dossier public
    swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        tagsSorter: 'alpha'
    }
};

// Routes de documentation (avant les autres routes)
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(specs, swaggerOptions));

// Route racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connexion à la base de données
(async () => {
  await connectDB();
  await initializeAdmin();
})();

// Routes API
app.use('/api/auth', require('./routes/auth'));
// Log des routes pour le debugging
const authRoutes = require('./routes/auth');
console.log('Routes auth disponibles:', 
  Object.keys(authRoutes.stack)
    .filter(key => authRoutes.stack[key].route)
    .map(key => {
      const r = authRoutes.stack[key].route;
      return {
        path: '/api/auth' + r.path,
        methods: Object.keys(r.methods)
      };
    })
);
app.use('/api/users', require('./routes/users'));
app.use('/api/catways', require('./routes/catways'));
app.use('/api/reservations', require('./routes/reservations'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Route 404 pour l'API
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint non trouvé'
    });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`Documentation API disponible sur http://localhost:${PORT}/api-docs`);
    console.log(`Page d'accueil disponible sur http://localhost:${PORT}`);
});

module.exports = app;
