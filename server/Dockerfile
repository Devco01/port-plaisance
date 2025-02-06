FROM node:18-alpine

WORKDIR /app/server

# Copier package.json et package-lock.json du serveur
COPY server/package*.json ./

# Installer les dépendances du serveur
RUN npm install --production=false

# Copier les fichiers du serveur
COPY server/ .

# Vérifier les modèles
RUN sh -c 'echo "=== Vérification des modèles ===" && ls -R models/'

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"] 