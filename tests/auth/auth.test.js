const request = require('supertest');
const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://port-plaisance.onrender.com'
    : 'http://localhost:3001'; 