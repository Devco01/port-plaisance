# Base stage
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package*.json ./
RUN npm ci

# Development stage
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS build
COPY . /app/.
# Installation sans cache et avec retry
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-cache && \
    npm run build || \
    (rm -rf node_modules && npm ci --no-cache && npm run build)
RUN echo "=== Vérification des modèles ===" && ls -R server/models/

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 5000
CMD ["npm", "start"] 