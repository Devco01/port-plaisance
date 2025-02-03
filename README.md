# Port de Plaisance - Application de Gestion

## Description
Application de gestion complète pour un port de plaisance permettant :
- Gestion des catways (ajout, modification, suppression)
- Gestion des réservations (planification, modification, annulation)
- Gestion des utilisateurs (administration, droits d'accès)
- Interface administrateur et utilisateur

## Prérequis
- Node.js (v14 ou supérieur)
- MongoDB
- npm ou yarn

## Installation

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/port-de-plaisance.git
cd port-de-plaisance
```

2. **Installer les dépendances du serveur**
```bash
npm install
```

3. **Installer les dépendances du client**
```bash
cd client
npm install
cd ..
```

4. **Configuration**
- Créer un fichier `.env` à la racine du projet :
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/port-plaisance
JWT_SECRET=PortRussell2024SecretKey
```

5. **Initialisation des utilisateurs de test**
Pour initialiser les utilisateurs de test, utilisez l'une des commandes suivantes selon votre système :

```powershell
# Windows (PowerShell)
Invoke-WebRequest -Uri "http://localhost:8000/api/users/init-test-users" -Method Post -ContentType "application/json"
```
```bash
# Linux/Mac
curl -X POST http://localhost:8000/api/users/init-test-users
```

## Démarrage

1. **Démarrer le serveur**
```bash
# Mode développement
npm run dev:server

# Mode production
npm run start:server
```

2. **Démarrer le client** (dans un nouveau terminal)
```bash
# Mode développement
npm run start:client
```

## Utilisateur de test
L'application dispose de deux comptes préconfigurés pour tester les différentes fonctionnalités :

### Compte Administrateur
```
Email: admin@portplaisance.fr
Mot de passe: PortAdmin2024!
Rôle: admin
```

### Compte Utilisateur Standard
```
Email: user@portplaisance.fr
Mot de passe: UserPort2024!
Rôle: user
```

Ces comptes sont créés automatiquement lors de l'initialisation (étape 5 de l'installation).


L'application sera accessible sur :
- Client : http://localhost:3000
- API : http://localhost:8000
- Documentation API : http://localhost:8000/api-docs

## Fonctionnalités

### Administrateur
- Gestion complète des catways
- Gestion des utilisateurs
- Gestion des réservations
- Tableau de bord administratif

### Utilisateur Standard
- Consultation des catways disponibles
- Gestion de ses réservations
- Modification de son profil

## Scripts disponibles
Dans le répertoire racine :
### Scripts de développement
- `npm run dev:server` : Démarre le serveur en mode développement avec nodemon
- `npm run dev:client` : Démarre le client React en mode développement

### Scripts de production
- `npm run start` : Démarre l'application en production
- `npm run build` : Construit l'application pour la production
- `npm run postinstall` : Script exécuté automatiquement après l'installation

## API Documentation
La documentation de l'API est disponible sur http://localhost:8000/api-docs une fois le serveur démarré.

## Sécurité
- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Validation des données
- Protection CORS

## Déploiement

### Prérequis
- Compte MongoDB Atlas
- Compte Render.com

### Configuration
1. Copier `.env.example` vers `.env`
2. Configurer les variables d'environnement :
   - MONGODB_URI : URL de connexion MongoDB Atlas
   - JWT_SECRET : Clé secrète pour les tokens JWT
   - PORT : Port du serveur (8000 par défaut)
   - API_URL : URL de l'API

### Variables d'environnement sur Render
- MONGODB_URI
- JWT_SECRET
- PORT=8000
