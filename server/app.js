require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { checkAndCreateAdmin } = require('./scripts/checkAdmin');

const app = express();

// Configuration CORS
app.use(cors({
    origin: true,  // Accepter l'origine de la requête
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/user');
const catwaysRoutes = require('./routes/catways');
const reservationsRoutes = require('./routes/reservations');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/catways', catwaysRoutes);
app.use('/api/reservations', reservationsRoutes);

// Documentation API
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance',
            version: '1.0.0',
            description: 'API de gestion des catways et réservations'
        },
        servers: [
            {
                url: 'http://localhost:3001/api'
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    console.log('=== Vérification de l\'administrateur ===');
    checkAndCreateAdmin()
      .then(() => {
        console.log('=== Fin de la vérification ===');
      })
      .catch(err => {
        console.error('❌ Erreur lors de la vérification admin:', err);
      });
  })
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
