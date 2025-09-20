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

# Remove default nginx configuration
RUN rm -rf /etc/nginx/nginx.conf

# Copy the built files from the previous stage
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html

# Copy Kubernetes-specific nginx configuration
COPY docker/nginx-k8s.conf /etc/nginx/nginx.conf

# Verify the configuration file was copied correctly
RUN cat /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]