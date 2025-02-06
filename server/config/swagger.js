const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance Russell',
            version: '1.0.0',
            description: `
# API de Gestion du Port de Plaisance Russell

Cette API permet la gestion des réservations de catways pour le port de plaisance de Russell.

## Fonctionnalités principales

### 1. Gestion des Catways
- Création de catways
- Liste des catways disponibles
- Détails d'un catway spécifique
- Modification de l'état d'un catway
- Suppression d'un catway

### 2. Gestion des Réservations
- Création de réservations
- Liste des réservations
- Détails d'une réservation
- Modification d'une réservation
- Suppression d'une réservation

### 3. Gestion des Utilisateurs
- Création d'utilisateurs
- Liste des utilisateurs
- Détails d'un utilisateur
- Modification d'un utilisateur
- Suppression d'un utilisateur

## Authentification
L'API utilise l'authentification JWT (JSON Web Token). Un token doit être inclus dans le header 'Authorization' pour accéder aux endpoints protégés.
            `,
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Serveur de développement',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Catway: {
                    type: 'object',
                    required: ['catwayNumber', 'type'],
                    properties: {
                        catwayNumber: {
                            type: 'string',
                            description: 'Numéro unique du catway'
                        },
                        type: {
                            type: 'string',
                            enum: ['long', 'short'],
                            description: 'Type de catway'
                        },
                        state: {
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
                            description: 'Date de début de la réservation'
                        },
                        endDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de fin de la réservation'
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
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            {
                name: 'Catways',
                description: 'Opérations sur les catways'
            },
            {
                name: 'Réservations',
                description: 'Opérations sur les réservations'
            },
            {
                name: 'Utilisateurs',
                description: 'Opérations sur les utilisateurs'
            },
            {
                name: 'Authentification',
                description: 'Opérations d\'authentification'
            }
        ]
    },
    apis: ['./routes/*.js'], // Chemin vers les fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
