var swaggerJsdoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var fs = require('fs');
var path = require('path');
var express = require('express');

var swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance Russell',
            version: '1.0.0',
            description: 'API de gestion des réservations de catways',
            contact: {
                name: 'Support API',
                email: 'support@port-russell.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3000',
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
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Message d\'erreur'
                        }
                    }
                },
                User: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Nom d\'utilisateur'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Adresse email'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            description: 'Mot de passe'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'Rôle de l\'utilisateur'
                        },
                        active: {
                            type: 'boolean',
                            description: 'Statut du compte'
                        }
                    }
                },
                Catway: {
                    type: 'object',
                    required: ['catwayNumber', 'catwayType'],
                    properties: {
                        catwayNumber: {
                            type: 'string',
                            description: 'Numéro unique du catway'
                        },
                        catwayType: {
                            type: 'string',
                            enum: ['long', 'short'],
                            description: 'Type de catway'
                        },
                        catwayState: {
                            type: 'string',
                            enum: ['disponible', 'occupé', 'maintenance'],
                            description: 'État du catway'
                        }
                    }
                },
                Reservation: {
                    type: 'object',
                    required: ['catwayNumber', 'clientName', 'boatName', 'startDate', 'endDate'],
                    properties: {
                        catwayNumber: {
                            type: 'string',
                            description: 'Numéro du catway réservé'
                        },
                        clientName: {
                            type: 'string',
                            description: 'Nom du client'
                        },
                        boatName: {
                            type: 'string',
                            description: 'Nom du bateau'
                        },
                        boatLength: {
                            type: 'number',
                            description: 'Longueur du bateau en mètres'
                        },
                        startDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Date de début de réservation'
                        },
                        endDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Date de fin de réservation'
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./server/routes/*.js']
};

var specs = swaggerJsdoc(swaggerOptions);
var app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: fs.readFileSync(path.join(__dirname, '../../public/css/swagger-custom.css'), 'utf8'),
    customSiteTitle: 'API Port de Plaisance Russell - Documentation',
    customfavIcon: '/images/favicon.ico'
}));

module.exports = specs; 
