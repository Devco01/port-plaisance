FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY server/package*.json ./server/

# Installer les dépendances
RUN npm ci --production=false
RUN cd server && npm ci --production=false

# Copier le reste des fichiers
COPY . .

# Vérifier les modèles (tout sur une seule ligne RUN)
RUN sh -c 'echo "=== Vérification des modèles ===" && ls -R server/models/'

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"] 