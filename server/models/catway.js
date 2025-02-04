var mongoose = require('mongoose');

var catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    catwayType: {
        type: String,
        required: true,
        enum: ['long', 'short'],
        default: 'short'
    },
    catwayState: {
        type: String,
        required: true,
        enum: ['disponible', 'occupé', 'maintenance'],
        default: 'disponible'
    },
    description: {
        type: String,
        trim: true
    },
    lastMaintenanceDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Empêcher la modification du type après création
catwaySchema.pre('save', function(next) {
    if (!this.isNew && this.isModified('catwayType')) {
        next(new Error('Le type de catway ne peut pas être modifié'));
    }
    next();
});

// Méthode pour vérifier la disponibilité
catwaySchema.methods.isAvailable = function() {
    return this.catwayState === 'disponible';
};

// Méthode pour mettre à jour l'état
catwaySchema.methods.updateState = function(newState) {
    if (!this.schema.path('catwayState').enumValues.includes(newState)) {
        throw new Error('État invalide');
    }
    this.catwayState = newState;
    return this.save();
};

// Méthode pour enregistrer une maintenance
catwaySchema.methods.setMaintenance = function(date) {
    this.lastMaintenanceDate = date || new Date();
    this.catwayState = 'maintenance';
    return this.save();
};

var Catway = mongoose.model('Catway', catwaySchema);

module.exports = Catway;
