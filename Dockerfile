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
RUN --mount=type=cache,id=s/4b8b76a0-67f7-4ba6-be4f-4c9bc8ce7c82-node_modules/cache,target=/app/node_modules/.cache npm run install:prod
RUN echo "=== Vérification des modèles ===" && ls -R server/models/

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 5000
CMD ["npm", "start"] 