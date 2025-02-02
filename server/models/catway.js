const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: [true, 'Le numéro du catway est requis'],
        unique: true
    },
    catwayType: {
        type: String,
        enum: ['small', 'medium', 'large'],
        required: [true, 'Le type de catway est requis']
    },
    catwayState: {
        type: String,
        enum: ['disponible', 'occupé', 'maintenance'],
        default: 'disponible'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Catway', catwaySchema);
