# Build stage
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build --workspace=frontend

# Production stage
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/entrypoint.sh /docker/entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /docker/entrypoint.sh

# Expose port 80 (this is informational)
EXPOSE 80

# Use the entrypoint script to start nginx
ENTRYPOINT ["/docker/entrypoint.sh"]