const config = {
    baseUrl:
        process.env.NODE_ENV === 'production'
            ? 'https://port-plaisance.onrender.com'
            : 'http://localhost:3001',
    apiUrl:
        process.env.NODE_ENV === 'production'
            ? 'https://port-plaisance.onrender.com/api'
            : 'http://localhost:3001/api'
};

// Log de la configuration en développement
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Configuration API:', {
        baseUrl: config.baseUrl,
        apiUrl: config.apiUrl
    });
}

export default config;
