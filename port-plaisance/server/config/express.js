const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const corsOptions = require('./cors');

module.exports = (app) => {
  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(cors(corsOptions));

  // Request parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  return app;
};
