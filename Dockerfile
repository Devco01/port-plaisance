FROM node:18-alpine

WORKDIR /app

# Copier tout le contexte d'abord
COPY . .

# Installer les dépendances
RUN npm ci --production=false
RUN cd server && npm ci --production=false

# Vérifier les modèles
RUN sh -c 'echo "=== Vérification des modèles ===" && ls -R server/models/'

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"] 