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
                url: process.env.NODE_ENV === 'production'
                    ? 'https://port-plaisance.onrender.com'
                    : 'http://localhost:3001',
                description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development'
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