const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      /^https:\/\/port-plaisance-[a-z0-9]+-devco01s-projects\.vercel\.app$/
    ];
    
    // Permettre les requêtes sans origine (ex: Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Vérifier si l'origine correspond à une des expressions autorisées
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;
