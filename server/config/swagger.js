const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance - Russell',
            version: '1.0.0',
            description: 'API de gestion des réservations de catways pour le port de plaisance de Russell',
        },
        tags: [
            {
                name: 'Catways',
                description: 'Gestion des catways (appontements)'
            },
            {
                name: 'Réservations',
                description: 'Gestion des réservations de catways'
            },
            {
                name: 'Utilisateurs',
                description: 'Gestion des utilisateurs'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJsDoc(options);
