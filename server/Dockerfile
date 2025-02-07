# Étape de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install -g npm@latest && \
    # Nettoyer le cache npm
    npm cache clean --force && \
    # Installer les dépendances
    npm install

# Copier le reste des fichiers
COPY . .

# Étape de production
FROM node:18-alpine AS runner

WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/*.js ./

# Exposer le port
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "start"] 