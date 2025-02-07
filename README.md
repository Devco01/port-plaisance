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

## Architecture

### Gestion des erreurs

L'application utilise un système centralisé de gestion des erreurs via le composant `ErrorHandler.vue`.
Les erreurs sont affichées dans une notification en haut à droite de l'écran.

- En développement : affiche les détails complets de l'erreur
- En production : affiche uniquement le message d'erreur

### API

Toutes les requêtes API sont préfixées par `/api` et gérées par :

- En développement : proxy Vite vers `http://localhost:5000`
- En production : rewrites Vercel vers l'API de production

## Configuration

### Développement
- Créer un fichier `.env.local` avec :
```
VITE_API_URL=http://localhost:5000/api
```

### Production
- L'API est proxifiée via Vercel
- Les requêtes `/api/*` sont redirigées vers l'API de production
- Pas besoin de configuration CORS côté client

## Développement
```
npm install
npm run dev
```

## Production
```
npm run build
```
