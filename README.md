# API Port de Plaisance Russell

Application de gestion des réservations de catways pour le port de plaisance Russell.

## 🚀 Fonctionnalités

- Gestion complète des catways (CRUD)
- Système de réservation
- Authentification des utilisateurs
- Interface d'administration
- Documentation API avec Swagger

## 🛠️ Technologies

- Backend: Node.js, Express
- Base de données: MongoDB
- Frontend: React, Material-UI
- Documentation: Swagger UI

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/port-russell-api.git

# Installer les dépendances
npm install
cd client && npm install

# Configurer les variables d'environnement
cp .env.example .env
```

## 🚀 Démarrage

```bash
# Mode développement
npm run dev          # Backend sur http://localhost:3001
cd client && npm start   # Frontend sur http://localhost:3000

# Mode production
npm run build
npm start
```

## 🧪 Tests

```bash
# Tous les tests
npm test

# Tests spécifiques
npm run test:models
npm run test:auth
npm run test:crud
```

## 🌐 Déploiement

L'application est déployée sur Render : [https://port-plaisance.onrender.com](https://port-plaisance.onrender.com)

### Accès démo
- Email : admin@portplaisance.fr
- Mot de passe : PortAdmin2024!

## 🔑 Variables d'environnement

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/port-russell
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# Sécurité
JWT_SECRET=votre_secret_jwt_super_securise
SESSION_SECRET=votre_secret_session_super_securise

# Serveur
PORT=3001

# Client
REACT_APP_API_URL=http://localhost:3001/api

# Admin
ADMIN_EMAIL=admin@portplaisance.fr
ADMIN_PASSWORD=PortAdmin2024!
```

## 👥 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: ajout d'une fonctionnalité'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request
