const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Port de Russell",
            version: "1.0.0"
        },
        paths: {
            "/catways": {
                get: {
                    tags: ["Catways"],
                    summary: "Liste l'ensemble des catways"
                },
                post: {
                    tags: ["Catways"],
                    summary: "Crée un catway"
                }
            },
            "/catways/{id}": {
                get: {
                    tags: ["Catways"],
                    summary: "Récupère les détails d'un catway en particulier"
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
            "/catways/{id}/reservations": {
                get: {
                    tags: ["Reservations"],
                    summary: "Liste l'ensemble des réservations"
                },
                post: {
                    tags: ["Reservations"],
                    summary: "Crée une réservation"
                }
            },
            "/catways/{id}/reservations/{idReservation}": {
                get: {
                    tags: ["Reservations"],
                    summary: "Récupère les détails d'une réservation en particulier"
                },
                put: {
                    tags: ["Reservations"],
                    summary: "Modifie une réservation"
                },
                delete: {
                    tags: ["Reservations"],
                    summary: "Supprime une réservation"
                }
            },
            "/users": {
                get: {
                    tags: ["Utilisateurs"],
                    summary: "Liste l'ensemble des utilisateurs"
                },
                post: {
                    tags: ["Utilisateurs"],
                    summary: "Crée un utilisateur"
                }
            },
            "/users/{email}": {
                get: {
                    tags: ["Utilisateurs"],
                    summary: "Récupère les détails d'un utilisateur en particulier"
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
            "/login": {
                post: {
                    tags: ["Utilisateurs"],
                    summary: "Connexion utilisateur"
                }
            },
            "/logout": {
                get: {
                    tags: ["Utilisateurs"],
                    summary: "Déconnexion utilisateur"
                }
            }
        },
        tags: [
            {
                name: "Catways",
                description: "Gestion des catways"
            },
            {
                name: "Reservations",
                description: "Gestion des réservations"
            },
            {
                name: "Utilisateurs",
                description: "Gestion des utilisateurs"
            }
        ]
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 