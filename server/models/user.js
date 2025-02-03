const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Le nom d\'utilisateur est requis'],
        trim: true,
        minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
        maxlength: [50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Veuillez fournir une adresse email valide'
        ]
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
        validate: {
            validator: function(v) {
                // Au moins une majuscule, une minuscule, un chiffre et un caractère spécial
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Le rôle doit être soit "user" soit "admin"'
        },
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Index pour optimiser les recherches
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour générer un token de réinitialisation de mot de passe
userSchema.methods.generatePasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 3600000; // 1 heure
    return resetToken;
};

// Méthode pour vérifier si le compte est actif
userSchema.methods.isActive = function() {
    return this.active;
};

// Méthode pour désactiver le compte
userSchema.methods.deactivate = function() {
    this.active = false;
    return this.save();
};

// Méthode pour activer le compte
userSchema.methods.activate = function() {
    this.active = true;
    return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
