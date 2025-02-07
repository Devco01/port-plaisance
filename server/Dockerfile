FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installation des dépendances en mode production
RUN npm set progress=false && \
    npm config set cache /tmp/empty-cache && \
    npm install --production && \
    rm -rf /tmp/empty-cache

# Copier le reste des fichiers
COPY . .

# Exposer le port
EXPOSE 3001

# Variables d'environnement pour Railway
ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["npm", "start"] 