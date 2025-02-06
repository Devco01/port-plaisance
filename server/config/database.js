const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('\n=== Configuration MongoDB ===');
        console.log('URI:', process.env.MONGODB_URI);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ Connecté à MongoDB');
        console.log('📦 Base de données:', conn.connection.db.databaseName);
        console.log('📝 Collections:');
        
        const collections = await conn.connection.db.collections();
        for (let collection of collections) {
            const count = await collection.countDocuments();
            console.log(`- ${collection.collectionName}: ${count} documents`);
        }
        
        console.log('=== Fin de la configuration ===\n');
        
        return conn;
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
