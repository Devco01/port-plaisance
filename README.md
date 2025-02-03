# Port Russell - API de gestion des catways

Application web de gestion des réservations de catways pour le port de plaisance Russell.

## 🚀 Démo

L'application est déployée sur Render : [https://port-russell-api.onrender.com](https://port-russell-api.onrender.com)

Identifiants de démonstration :
- Email : admin@port-russell.com
- Mot de passe : Admin123!

## 📋 Fonctionnalités

- Authentification sécurisée (JWT)
- Gestion des catways (création, modification, suppression)
- Gestion des réservations
- Gestion des utilisateurs
- Interface d'administration
- API REST documentée

## 🛠 Technologies utilisées

- Node.js
- Express
- MongoDB
- EJS
- JWT
- Swagger

## 💻 Installation locale

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-username/port-russell-api.git
cd port-russell-api
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Éditer le fichier .env avec vos configurations
```

4. Initialiser la base de données :
```bash
npm run seed
```

5. Démarrer l'application :
```bash
npm run dev
```

## 🧪 Tests

Lancer les tests :
```bash
npm test
```

Avec couverture de code :
```bash
npm run test:coverage
```

## 📚 Documentation API

La documentation de l'API est disponible à l'adresse : [https://port-russell-api.onrender.com/api-docs](https://port-russell-api.onrender.com/api-docs)

### Points d'entrée principaux

#### Catways
- `GET /api/catways` - Liste des catways
- `GET /api/catways/:id` - Détails d'un catway
- `POST /api/catways` - Créer un catway
- `PUT /api/catways/:id` - Modifier un catway
- `DELETE /api/catways/:id` - Supprimer un catway

#### Réservations
- `GET /api/catways/:id/reservations` - Liste des réservations d'un catway
- `POST /api/catways/:id/reservations` - Créer une réservation
- `PUT /api/catways/:id/reservations/:idReservation` - Modifier une réservation
- `DELETE /api/catways/:id/reservations/:idReservation` - Supprimer une réservation

#### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:email` - Détails d'un utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:email` - Modifier un utilisateur
- `DELETE /api/users/:email` - Supprimer un utilisateur

## 🔒 Sécurité

- Authentification JWT
- Mots de passe hashés avec bcrypt
- Protection CSRF
- Headers de sécurité avec Helmet
- Validation des données
- Rate limiting

## 🌐 Déploiement

L'application est déployée sur Render.

## 📝 Licence

MIT

## 👥 Auteur

[Votre nom]

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
