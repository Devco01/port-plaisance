const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Le nom du client est requis']
    },
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis']
    },
    startDate: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise']
    },
    catwayNumber: {
        type: Number,
        required: [true, 'Le numéro de catway est requis']
    },
    catway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catway',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Vérifier que la date de fin est après la date de début
reservationSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        next(new Error('La date de fin doit être après la date de début'));
    }
    next();
});

// Middleware pour vérifier la cohérence des données
reservationSchema.pre('save', async function(next) {
    try {
        const Catway = mongoose.model('Catway');
        const catway = await Catway.findById(this.catway);
        if (!catway) {
            throw new Error('Catway non trouvé');
        }
        this.catwayNumber = catway.catwayNumber;
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour le debug
reservationSchema.methods.toJSON = function() {
    const obj = this.toObject();
    console.log('Conversion en JSON:', {
        id: obj._id,
        catway: obj.catway,
        catwayNumber: obj.catwayNumber
    });
    return obj;
};

module.exports = mongoose.model('Reservation', reservationSchema); 