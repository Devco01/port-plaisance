# API Port de Plaisance

Application web de gestion des réservations de catways pour le port de plaisance de Russell.

## Description

Cette API permet la gestion des catways (petits appontements pour amarrer un bateau) et leurs réservations. Elle inclut :
- Une interface d'administration
- Une API REST sécurisée
- Une documentation interactive

## Fonctionnalités

### 1. Gestion des catways
- Liste des catways
- Création d'un catway
- Modification de l'état
- Suppression

### 2. Gestion des réservations
- Liste des réservations par catway
- Création d'une réservation
- Modification d'une réservation
- Suppression d'une réservation

### 3. Gestion des utilisateurs
- Création de compte
- Connexion/Déconnexion
- Gestion des profils

## Technologies utilisées

- Backend : Node.js, Express, MongoDB
- Frontend : Vue.js 3, Pinia
- Documentation : Swagger/OpenAPI

## Installation

1. Cloner le repository
```bash
git clone https://github.com/Devco01/port-plaisance
```

2. Installer les dépendances
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

3. Configurer les variables d'environnement
```bash
# Créer un fichier .env à la racine
cp .env.example .env
```

4. Lancer l'application
```bash
# Backend
npm run dev

# Frontend
npm run dev
```

## Documentation API

La documentation de l'API est accessible à l'adresse : `/api-docs`

## Identifiants de test

```
Email : admin@portplaisance.fr
Mot de passe : PortAdmin2024!
```

## Auteur

Devco01
