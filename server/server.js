require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3001;

// Connexion à la base de données
connectDB();

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(Serveur démarré sur le port \);
});
