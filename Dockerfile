FROM node:18-alpine

WORKDIR /app

# Copier tout le contexte d'abord
COPY . .

# Installer les dépendances avec npm install au lieu de npm ci
RUN npm install --production=false
RUN cd server && npm install --production=false

# Vérifier les modèles
RUN sh -c 'echo "=== Vérification des modèles ===" && ls -R server/models/'

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"] 