const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Trying to connect to MongoDB with URI:', 
            process.env.MONGODB_URI?.substring(0, 20) + '...');
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'port-de-plaisance'
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.db.databaseName}`);
        
        // Vérifier que la connexion est active
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB connection is ready and active');
        } else {
            console.error('MongoDB connection is not ready:', 
                mongoose.connection.readyState);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
