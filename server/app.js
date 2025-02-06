require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { checkAndCreateAdmin } = require('./scripts/checkAdmin');

const app = express();

// Middleware
app.use(cors({
    origin: true, // Permet toutes les origines en développement
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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
                url: 'http://localhost:3001'
            }
        ]
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/User');
const catwaysRoutes = require('./routes/catways');
const reservationsRoutes = require('./routes/reservations');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/catways', catwaysRoutes);
app.use('/api/catways', reservationsRoutes);

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
