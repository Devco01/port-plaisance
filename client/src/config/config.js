const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000'
};

// Log de la configuration en développement
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Configuration API:', config.apiUrl);
}

export default config; 