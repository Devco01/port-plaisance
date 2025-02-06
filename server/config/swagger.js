const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Port de Plaisance",
            version: "1.0.0",
            description: "API de gestion des réservations de catways pour le port de plaisance"
        },
        tags: [
            { name: "Catways", description: "Opérations sur les catways" },
            { name: "Reservations", description: "Opérations sur les réservations" },
            { name: "Utilisateurs", description: "Opérations sur les utilisateurs" }
        ],
        paths: {
            // 1. Gestion des catways (section 3.1)
            "/api/catways": {
                get: {
                    tags: ["Catways"],
                    summary: "Liste l'ensemble des catways"
                },
                post: {
                    tags: ["Catways"],
                    summary: "Crée un catway"
                }
            },
            "/api/catways/{id}": {
                get: {
                    tags: ["Catways"],
                    summary: "Récupère les détails d'un catway"
                },
                put: {
                    tags: ["Catways"],
                    summary: "Modifie la description de l'état d'un catway"
                },
                delete: {
                    tags: ["Catways"],
                    summary: "Supprime un catway"
                }
            },

            // 2. Gestion des réservations (section 3.2)
            "/api/catways/{id}/reservations": {
                get: {
                    tags: ["Reservations"],
                    summary: "Liste l'ensemble des réservations"
                },
                post: {
                    tags: ["Reservations"],
                    summary: "Crée une réservation"
                },
                put: {
                    tags: ["Reservations"],
                    summary: "Modifie une réservation"
                }
            },
            "/api/catway/{id}/reservations/{idReservation}": {
                get: {
                    tags: ["Reservations"],
                    summary: "Récupère les détails d'une réservation"
                },
                delete: {
                    tags: ["Reservations"],
                    summary: "Supprime une réservation"
                }
            },

            // 3. Gestion des utilisateurs (section 3.3)
            "/api/users": {
                get: {
                    tags: ["Utilisateurs"],
                    summary: "Liste l'ensemble des utilisateurs"
                },
                post: {
                    tags: ["Utilisateurs"],
                    summary: "Crée un utilisateur"
                }
            },
            "/api/users/{email}": {
                get: {
                    tags: ["Utilisateurs"],
                    summary: "Récupère les détails d'un utilisateur"
                },
                put: {
                    tags: ["Utilisateurs"],
                    summary: "Modifie les détails d'un utilisateur"
                },
                delete: {
                    tags: ["Utilisateurs"],
                    summary: "Supprime un utilisateur"
                }
            },

            // Routes d'authentification
            "/api/login": {
                post: {
                    tags: ["Utilisateurs"],
                    summary: "Connexion"
                }
            },
            "/api/logout": {
                get: {
                    tags: ["Utilisateurs"],
                    summary: "Déconnexion"
                }
            }
        }
    },
    apis: ["./server/routes/*.js"]
};

const specs = swaggerJsdoc(options);
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    customSiteTitle: "API Port de Plaisance - Documentation"
}));

module.exports = specs;
