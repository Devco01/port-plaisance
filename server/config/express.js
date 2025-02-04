var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var compression = require('compression');
var session = require('express-session');
var flash = require('connect-flash');
var expressLayouts = require('express-ejs-layouts');

/**
 * Configure l'application Express
 * @param {Express.Application} app - L'application Express
 */
var configureExpress = function (app) {
    // Middleware de base
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(compression());

    // Configuration CORS
    var corsOptions = {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };
    app.use(cors(corsOptions));

    // Configuration des vues
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
    app.use(expressLayouts);
    app.set('layout', 'layouts/main');

    // Fichiers statiques
    app.use(express.static(path.join(__dirname, '../public')));

    // Configuration des sessions
    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 heures
            }
        })
    );

    // Configuration des messages flash
    app.use(flash());

    // Variables globales pour les vues
    app.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
    });
};

module.exports = configureExpress;
