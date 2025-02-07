const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true,
        unique: true
    },
    catwayType: {
        type: String,
        enum: ['long', 'short'],
        required: true
    },
    catwayState: {
        type: String,
        required: true
    }
}, { timestamps: true });

catwaySchema.pre('save', async function() {
    try {
        await mongoose.connection.collection('catways').dropIndex('number_1');
    } catch (error) {
        // Ignorer l'erreur si l'index n'existe pas
    }
});

module.exports = mongoose.model('Catway', catwaySchema); 