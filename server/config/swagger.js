const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Port de Plaisance',
      version: '1.0.0',
      description: 'API de gestion des réservations de catways pour le port de plaisance',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://port-plaisance-api.onrender.com' 
          : 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production' 
          ? 'Serveur de production' 
          : 'Serveur de développement',
      },
    ],
  },
  apis: ['./server/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
