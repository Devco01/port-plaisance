module.exports = {
    // Configuration de la base de données
    db: {
        uri:
            process.env.MONGODB_URI ||
            'mongodb://localhost:27017/port_plaisance',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // Configuration JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'dev_secret_key',
        expiresIn: '24h'
    },

    // Configuration des cookies
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    },

    // Configuration de l'application
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },

    // Configuration des validations
    validation: {
        password: {
            minLength: 8,
            requireCapital: true,
            requireNumber: true,
            pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
        }
    },

    // Configuration des chemins
    paths: {
        data: process.env.DATA_PATH || './data',
        uploads: process.env.UPLOADS_PATH || './uploads'
    }
};
