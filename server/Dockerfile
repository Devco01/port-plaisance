# Étape de build
FROM node:20-alpine AS builder

WORKDIR /app

# Ajouter healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Étape de production
FROM node:20-alpine AS runner

WORKDIR /app

# Installation de wget pour le healthcheck
RUN apk add --no-cache wget

# Copier les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/*.js ./

# Exposer le port
EXPOSE 3001

# Ajouter healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Commande de démarrage
CMD ["npm", "start"] 