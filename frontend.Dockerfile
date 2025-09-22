# Stage 1: Build the frontend
FROM node:20 AS build
WORKDIR /app

# Copy only the package.json files first (for caching)
COPY ./packages/frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY ./packages/frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
