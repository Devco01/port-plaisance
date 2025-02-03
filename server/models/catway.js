const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: [true, 'Le numéro du catway est requis'],
        unique: true,
        immutable: true
    },
    catwayType: {
        type: String,
        enum: ['long', 'short'],
        required: [true, 'Le type de catway est requis'],
        immutable: true
    },
    catwayState: {
        type: String,
        required: true,
        default: 'Bon état'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Catway', catwaySchema);
