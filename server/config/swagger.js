const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance',
            version: '1.0.0',
            description: 'Documentation de l\'API du Port de Plaisance'
        },
        servers: [
            {
                url: '/api',
                description: process.env.NODE_ENV === 'production' ? 'Serveur de production' : 'Serveur de développement'
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
    apis: [
        './server/routes/*.js',
        './server/models/*.js'
    ]
};

module.exports = swaggerJsdoc(swaggerOptions); 