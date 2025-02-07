import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://port-plaisance.vercel.app',
    'https://port-plaisance-lbczcqhln-devco01s-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  maxAge: 86400
}));

// Enable pre-flight requests for all routes
app.options('*', cors()); 