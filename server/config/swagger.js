var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var fs = require("fs");
var path = require("path");
var express = require("express");

var options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Port de Plaisance",
            version: "1.0.0",
            description: "API de gestion du port de plaisance"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                User: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string", minLength: 8 },
                        role: { type: "string", enum: ["user", "admin"] }
                    }
                },
                Catway: {
                    type: "object",
                    required: ["catwayNumber", "catwayType", "catwayState"],
                    properties: {
                        catwayNumber: { type: "string" },
                        catwayType: { type: "string", enum: ["long", "short"] },
                        catwayState: {
                            type: "string",
                            enum: ["disponible", "occupé", "maintenance"]
                        }
                    }
                },
                Reservation: {
                    type: "object",
                    required: [
                        "catwayNumber",
                        "clientName",
                        "startDate",
                        "endDate"
                    ],
                    properties: {
                        catwayNumber: { type: "string" },
                        clientName: { type: "string" },
                        boatName: { type: "string" },
                        startDate: { type: "string", format: "date-time" },
                        endDate: { type: "string", format: "date-time" }
                    }
                }
            }
        }
    },
    apis: ["./server/routes/*.js"]
};

var specs = swaggerJsdoc(options);
var app = express();

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        customCss: fs.readFileSync(
            path.join(__dirname, "../../public/css/swagger-custom.css"),
            "utf8"
        ),
        customSiteTitle: "API Port de Plaisance Russell - Documentation",
        customfavIcon: "/images/favicon.ico"
    })
);

module.exports = specs;
