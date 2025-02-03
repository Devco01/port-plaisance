const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

/**
 * Configuration d'Express
 * @param {Express.Application} app - L'application Express
 */
const configureExpress = (app) => {
    // Configuration EJS
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
    app.use(expressLayouts);
    app.set('layout', 'layouts/main');

    // Middleware pour les fichiers statiques
    app.use(express.static(path.join(__dirname, '../public')));
    
    // Configuration des sessions
    app.use(session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 heures
        }
    }));

    // Configuration des messages flash
    app.use(flash());

    // Variables globales pour les vues
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
    });
};

module.exports = configureExpress; 