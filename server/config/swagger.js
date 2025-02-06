const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance - Russell',
            version: '1.0.0',
            description: 'API de gestion des réservations de catways pour le port de plaisance de Russell',
        },
        components: {
            schemas: {
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
                        startDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de début de réservation'
                        },
                        endDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de fin de réservation'
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
                            default: 'user',
                            description: 'Rôle de l\'utilisateur'
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
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
                description: 'Gestion des utilisateurs et authentification'
            }
        ]
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerJsDoc(options);
