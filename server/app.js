require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');
const { checkAndCreateAdmin } = require('./scripts/checkAdmin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Documentation API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/catways', require('./routes/catways'));
app.use('/api/users', require('./routes/users'));
app.use('/api', require('./routes/auth'));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    checkAndCreateAdmin();
  })
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\🚀 Serveur démarré sur le port \\);
});
