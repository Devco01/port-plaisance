# Port de Plaisance - Application de Gestion

## Description
Application de gestion complète pour un port de plaisance permettant :
- Gestion des catways (ajout, modification, suppression)
- Gestion des réservations (planification, modification, annulation)
- Gestion des utilisateurs (administration, droits d'accès)
- Interface administrateur et utilisateur

## Démo
L'application est déployée sur Render : [https://port-plaisance.onrender.com](https://port-plaisance.onrender.com)

## Installation et Configuration

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB
- npm ou yarn

### Installation
1. Cloner le projet
2. Installer les dépendances (npm install)
3. Configurer les variables d'environnement (.env)
4. Démarrer l'application (npm run dev)

### Variables d'environnement
Copier `.env.example` vers `.env` et configurer :
- MONGODB_URI : URL de connexion MongoDB
- JWT_SECRET : Clé secrète pour les tokens
- PORT : Port du serveur (3001 par défaut)

## Utilisation

### Compte Administrateur
```
Email: admin@portplaisance.fr
Mot de passe: PortAdmin2024!
```

### URLs principales
- Application : http://localhost:3000
- API : http://localhost:3001
- Documentation API : http://localhost:3001/api-docs

## Scripts disponibles
- `npm run dev:server` : Démarre le serveur en développement
- `npm run dev:client` : Démarre le client React
- `npm run start` : Démarre en production
- `npm run build` : Build l'application
