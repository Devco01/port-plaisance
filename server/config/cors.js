const corsOptions = {
  origin: true,  // Permet toutes les origines en développement
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-vercel-skip-auth'],
};

module.exports = corsOptions;
