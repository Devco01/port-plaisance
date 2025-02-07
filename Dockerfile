COPY . /app/.
RUN --mount=type=cache,id=s/4b8b76a0-67f7-4ba6-be4f-4c9bc8ce7c82-node_modules/cache,target=/app/node_modules/.cache npm run install:prod
RUN echo "=== Vérification des modèles ===" && ls -R server/models/

# Build stage
FROM node:18-alpine AS builder 