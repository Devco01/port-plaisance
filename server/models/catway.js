const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: [true, 'Le numéro du catway est requis'],
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                // Format: lettre(s) suivie(s) de chiffre(s) (ex: A1, B12, AA1)
                return /^[A-Z]+[0-9]+$/.test(v);
            },
            message: 'Le numéro du catway doit être composé d\'une lettre suivie de chiffres'
        }
    },
    catwayType: {
        type: String,
        required: [true, 'Le type de catway est requis'],
        enum: {
            values: ['long', 'short'],
            message: 'Le type doit être soit "long" soit "short"'
        }
    },
    catwayState: {
        type: String,
        required: [true, 'L\'état du catway est requis'],
        enum: {
            values: ['disponible', 'occupé', 'maintenance'],
            message: 'L\'état doit être "disponible", "occupé" ou "maintenance"'
        },
        default: 'disponible'
    },
    maxBoatLength: {
        type: Number,
        required: true,
        min: [5, 'La longueur minimale est de 5 mètres'],
        max: [50, 'La longueur maximale est de 50 mètres'],
        default: function() {
            // Les catways longs peuvent accueillir des bateaux jusqu'à 20m
            // Les catways courts jusqu'à 12m
            return this.catwayType === 'long' ? 20 : 12;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index pour optimiser les recherches
catwaySchema.index({ catwayNumber: 1 }, { unique: true });
catwaySchema.index({ catwayType: 1 });
catwaySchema.index({ catwayState: 1 });

// Virtual pour les réservations actives
catwaySchema.virtual('activeReservations', {
    ref: 'Reservation',
    localField: 'catwayNumber',
    foreignField: 'catwayNumber',
    match: {
        endDate: { $gte: new Date() }
    },
    options: { sort: { startDate: 1 } }
});

// Méthode pour vérifier la disponibilité
catwaySchema.methods.isAvailable = function(startDate, endDate) {
    return this.catwayState === 'disponible' && 
           !this.activeReservations.some(reservation => {
               return (startDate <= reservation.endDate && 
                       endDate >= reservation.startDate);
           });
};

// Méthode pour vérifier si un bateau peut être accueilli
catwaySchema.methods.canAccommodateBoat = function(boatLength) {
    return boatLength <= this.maxBoatLength;
};

// Middleware pour mettre à jour la date de modification
catwaySchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Middleware pour empêcher la modification du numéro et du type
catwaySchema.pre('save', function(next) {
    if (!this.isNew && (this.isModified('catwayNumber') || this.isModified('catwayType'))) {
        next(new Error('Le numéro et le type du catway ne peuvent pas être modifiés'));
    }
    next();
});

const Catway = mongoose.model('Catway', catwaySchema);

module.exports = Catway;
