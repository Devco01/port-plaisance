const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://port-plaisance-k4q3anh15-devco01s-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;
