var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Email invalide']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash le mot de passe avant la sauvegarde
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    
    bcrypt.hash(this.password, 10, function(err, hash) {
        if (err) return next(err);
        this.password = hash;
        next();
    }.bind(this));
});

// Vérifie le mot de passe
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un objet public sans données sensibles
userSchema.methods.toPublic = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
