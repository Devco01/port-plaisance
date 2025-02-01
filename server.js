const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const userRoutes = require('./routes/userRoutes');
const catwayRoutes = require('./routes/catwayRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/reservations', reservationRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API Port de Plaisance est en ligne');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    connectDB();
});
