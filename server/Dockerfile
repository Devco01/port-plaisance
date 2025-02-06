FROM node:18-alpine

WORKDIR /app

# Copier package.json et package-lock.json du serveur
COPY package*.json ./

# Installer les dépendances du serveur
RUN npm install --production=false

# Copier tous les fichiers du serveur
COPY . .

# Vérifier les modèles
RUN sh -c 'echo "=== Vérification des modèles ===" && ls -R models/'

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"] 