var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
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
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10)
        .then(function(salt) {
            return bcrypt.hash(user.password, salt);
        })
        .then(function(hash) {
            user.password = hash;
            next();
        })
        .catch(function(err) {
            next(err);
        });
});

// Méthode pour comparer les mots de passe
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
