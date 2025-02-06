# API Port de Plaisance Russell

Application web de gestion des réservations de catways pour le port de plaisance de Russell.

## Description

Cette API permet la gestion des catways (petits appontements pour amarrer un bateau) et leurs réservations. Elle inclut :
- Une interface d'administration
- Une API REST sécurisée
- Une documentation interactive

## Installation

1. Cloner le repository
```bash
git clone https://github.com/Devco01/port-plaisance
cd port-plaisance
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

3. Configurer MongoDB
```bash
# Vérifier que MongoDB est installé et lancé
# L'application utilise l'URI par défaut : mongodb://localhost:27017/port-plaisance
```

4. Lancer l'application
```bash
# Backend (depuis /server)
npm run dev
# L'API sera disponible sur http://localhost:5000

# Frontend (depuis /client)
npm run dev
# L'interface sera disponible sur http://localhost:5173
```

## Documentation API

La documentation de l'API est accessible depuis la page d'accueil ou directement à l'adresse :
`http://localhost:5000/api-docs`

## Identifiants de test

```
Email : admin@portplaisance.fr
Mot de passe : PortAdmin2024!
```

## Auteur

Devco01
