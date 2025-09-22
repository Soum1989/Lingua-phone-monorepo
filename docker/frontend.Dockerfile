# Build stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm ci --only=production --prefix packages/frontend

# Copy frontend source code
COPY packages/frontend/src ./packages/frontend/src
COPY packages/frontend/public ./packages/frontend/public

# Build the frontend
RUN npm run build --prefix packages/frontend

# Production stage
from nginx:alpine

# Copy built frontend assets
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]