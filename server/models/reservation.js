const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: [true, 'Le numéro du catway est requis'],
        ref: 'Catway',
        validate: {
            validator: async function(v) {
                const catway = await mongoose.model('Catway').findOne({ catwayNumber: v });
                return catway !== null;
            },
            message: 'Ce catway n\'existe pas'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'utilisateur est requis']
    },
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis'],
        trim: true,
        minlength: [2, 'Le nom du bateau doit contenir au moins 2 caractères'],
        maxlength: [50, 'Le nom du bateau ne peut pas dépasser 50 caractères']
    },
    boatLength: {
        type: Number,
        required: [true, 'La longueur du bateau est requise'],
        min: [5, 'La longueur minimale est de 5 mètres'],
        max: [50, 'La longueur maximale est de 50 mètres']
    },
    startDate: {
        type: Date,
        required: [true, 'La date de début est requise'],
        validate: {
            validator: function(v) {
                return v >= new Date();
            },
            message: 'La date de début doit être future'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise'],
        validate: {
            validator: function(v) {
                return v > this.startDate;
            },
            message: 'La date de fin doit être postérieure à la date de début'
        }
    },
    status: {
        type: String,
        enum: {
            values: ['confirmée', 'annulée', 'terminée'],
            message: 'Statut invalide'
        },
        default: 'confirmée'
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
        default: function() {
            // Calcul du prix basé sur la durée et la taille du bateau
            const days = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
            const basePrice = this.boatLength * 10; // 10€ par mètre
            return days * basePrice;
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
reservationSchema.index({ catwayNumber: 1, startDate: 1, endDate: 1 });
reservationSchema.index({ user: 1 });
reservationSchema.index({ status: 1 });

// Virtual pour calculer la durée en jours
reservationSchema.virtual('duration').get(function() {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Middleware pour vérifier les chevauchements de dates
reservationSchema.pre('save', async function(next) {
    if (this.isModified('startDate') || this.isModified('endDate')) {
        const overlapping = await this.constructor.findOne({
            catwayNumber: this.catwayNumber,
            _id: { $ne: this._id },
            $or: [
                { startDate: { $lte: this.endDate }, endDate: { $gte: this.startDate } }
            ]
        });

        if (overlapping) {
            next(new Error('Ces dates sont déjà réservées pour ce catway'));
        }
    }
    next();
});

// Middleware pour mettre à jour l'état du catway
reservationSchema.post('save', async function() {
    const Catway = mongoose.model('Catway');
    const catway = await Catway.findOne({ catwayNumber: this.catwayNumber });
    
    if (catway) {
        const hasActiveReservations = await this.constructor.exists({
            catwayNumber: this.catwayNumber,
            endDate: { $gte: new Date() },
            status: 'confirmée'
        });

        catway.catwayState = hasActiveReservations ? 'occupé' : 'disponible';
        await catway.save();
    }
});

// Méthode pour annuler une réservation
reservationSchema.methods.cancel = async function() {
    this.status = 'annulée';
    await this.save();
    
    // Mettre à jour l'état du catway
    const Catway = mongoose.model('Catway');
    const catway = await Catway.findOne({ catwayNumber: this.catwayNumber });
    if (catway) {
        const hasActiveReservations = await this.constructor.exists({
            catwayNumber: this.catwayNumber,
            endDate: { $gte: new Date() },
            status: 'confirmée'
        });
        
        if (!hasActiveReservations) {
            catway.catwayState = 'disponible';
            await catway.save();
        }
    }
};

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
