# Stage 1: Build the frontend
FROM node:20 AS build
WORKDIR /app

# Copy the root package.json files
COPY package*.json ./

# Copy the frontend package.json files from the correct path
COPY ./packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY ./packages/frontend/ ./packages/frontend/

# Build frontend
RUN npm run build --workspace=frontend

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]