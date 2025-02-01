const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance',
            version: '1.0.0',
            description: 'API de gestion des réservations de catways pour un port de plaisance',
            contact: {
                name: 'Support API',
                email: 'support@port-plaisance.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Serveur de développement'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Accès non autorisé',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    msg: {
                                        type: 'string',
                                        example: 'Token invalide ou manquant'
                                    }
                                }
                            }
                        }
                    }
                },
                ServerError: {
                    description: 'Erreur serveur',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    msg: {
                                        type: 'string',
                                        example: 'Erreur interne du serveur'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options); 