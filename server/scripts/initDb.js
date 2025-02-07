const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();

const initializeAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Vérifier si l'admin existe déjà
    const adminExists = await User.findOne({ email: 'admin@portplaisance.fr' });
    if (adminExists) {
      console.log('Admin user already exists');
      // Mettre à jour le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('PortAdmin2024!', salt);
      adminExists.password = hashedPassword;
      await adminExists.save();
      console.log('Admin password updated');
    } else {
      // Créer l'admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('PortAdmin2024!', salt);
      
      const admin = new User({
        username: 'Admin',
        email: 'admin@portplaisance.fr',
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user created');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
  }
};

initializeAdmin(); 