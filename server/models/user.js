const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Vérifier si le modèle existe déjà
if (mongoose.models.User) {
    module.exports = mongoose.models.User;
} else {
    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: [true, 'Le nom d\'utilisateur est requis'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'L\'email est requis'],
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, 'Le mot de passe est requis'],
            minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    }, {
        timestamps: true
    });

    // Hash le mot de passe avant la sauvegarde
    userSchema.pre('save', async function(next) {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

    // Méthode pour comparer les mots de passe
    userSchema.methods.comparePassword = async function(candidatePassword) {
        console.log('Comparing passwords');
        console.log('Candidate password length:', candidatePassword?.length);
        console.log('Stored hash length:', this.password?.length);
        console.log('User data:', {
            email: this.email,
            role: this.role,
            passwordHash: this.password.substring(0, 10) + '...'
        });
        try {
            const isMatch = await bcrypt.compare(candidatePassword, this.password);
            console.log('Password comparison result:', isMatch);
            return isMatch;
        } catch (error) {
            console.error('Password comparison error:', error);
            console.error('Full error:', {
                message: error.message,
                stack: error.stack
            });
            return false;
        }
    };

    // Méthode pour générer un token JWT
    userSchema.methods.generateAuthToken = function() {
        return jwt.sign(
            { id: this._id, role: this.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    };

    module.exports = mongoose.model('User', userSchema);
}