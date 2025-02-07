FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installation simple des dépendances
RUN npm install --omit=dev

# Copier le reste des fichiers
COPY . .

# Exposer le port
EXPOSE 3001

# Variables d'environnement pour Railway
ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["npm", "start"] 