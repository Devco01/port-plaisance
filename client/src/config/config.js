const config = {
    apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://port-plaisance.onrender.com/api'
        : 'http://localhost:8000/api'
};

// Log de la configuration en développement
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Configuration API:', config.apiUrl);
}

export default config; 