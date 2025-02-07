const User = require('../models/user');

const initializeAdmin = async () => {
  try {
    console.log('Initializing admin user...');
    const plainPassword = 'PortAdmin2024!';
    console.log('Admin password to hash:', plainPassword);

    // Vérifier si l'admin existe déjà
    const adminExists = await User.findOne({ email: 'admin@portplaisance.fr' });
    if (adminExists) {
      console.log('Admin user already exists');
      // Mettre à jour le mot de passe
      adminExists.password = plainPassword;
      await adminExists.save();
      console.log('New password hash:', adminExists.password.substring(0, 10) + '...');
      console.log('Admin password updated');
      
      // Vérifier immédiatement que le mot de passe fonctionne
      const isMatch = await adminExists.comparePassword(plainPassword);
      console.log('Password verification after update:', isMatch ? 'success' : 'failed');
    } else {
      // Créer l'admin
      const admin = new User({
        username: 'Admin',
        email: 'admin@portplaisance.fr',
        password: plainPassword,  // Le hook pre('save') s'occupera du hash
        role: 'admin'
      });

      await admin.save();
      
      // Vérifier immédiatement que le mot de passe fonctionne
      const isMatch = await admin.comparePassword(plainPassword);
      console.log('Password verification after creation:', isMatch ? 'success' : 'failed');
      console.log('Admin user created');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = initializeAdmin; 