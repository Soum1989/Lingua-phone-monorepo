# Docker Port Configuration and Service Communication

This document explains how ports are configured in the Docker environment and how services communicate with each other.

## Port Configuration

### Docker Compose Services ([docker-compose.yml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker-compose.yml))

1. **Frontend Service**
   - External port: 8080
   - Internal port: 80 (Nginx)
   - Mapping: `"8080:80"`
   - Access URL: http://localhost:8080

2. **Backend Service**
   - External port: 3002
   - Internal port: 3002 (Node.js)
   - Mapping: `"3002:3002"`
   - Access URL: http://localhost:3002

### Development Environment Ports

1. **Frontend Development**
   - Port: 5175
   - Configured in [packages/frontend/vite.config.ts](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/packages/frontend/vite.config.ts)
   - Access URL: http://localhost:5175

2. **Backend Development**
   - Port: 3002
   - Configured in [packages/backend/src/server.ts](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/packages/backend/src/server.ts)
   - Access URL: http://localhost:3002

## Service Communication

### In Docker Environment

1. **Frontend to Backend Communication**
   - Nginx is configured with an upstream backend service:
     ```
     upstream backend {
         server lingua-backend-service:3002;
     }
     ```
   - API requests are proxied through Nginx:
     ```
     location /api/ {
         proxy_pass http://backend;
         # ... proxy headers
     }
     ```
   - This means when you access http://localhost:8080/api/..., Nginx forwards the request to the backend service running on port 3002.

2. **Container Names**
   - Frontend container: `lingua-frontend`
   - Backend container: `lingua-backend`
   - These names are used for service discovery within the Docker network.

### In Development Environment

1. **Frontend to Backend Communication**
   - Vite proxy configuration in [packages/frontend/vite.config.ts](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/packages/frontend/vite.config.ts):
     ```typescript
     proxy: {
       '/api': {
         target: 'http://localhost:3002',  // Docker backend port
         changeOrigin: true,
         secure: false,
       }
     }
     ```
   - This means when you access http://localhost:5175/api/... during development, Vite proxies the request to http://localhost:3002.

## No Port Conflicts

With this configuration, there are no port conflicts:

1. **Docker Environment**
   - Port 8080: Frontend Nginx server
   - Port 3002: Backend Node.js server

2. **Development Environment**
   - Port 5175: Frontend Vite development server
   - Port 3002: Backend Node.js server

## Accessing Services

### Docker Environment
- Frontend Application: http://localhost:8080
- Backend API Direct Access: http://localhost:3002/api/...
- Backend API via Frontend Proxy: http://localhost:8080/api/...

### Development Environment
- Frontend Application: http://localhost:5175
- Backend API Direct Access: http://localhost:3002/api/...
- Backend API via Frontend Proxy: http://localhost:5175/api/...

## Environment Variables

The backend uses the following environment variables for port configuration:
```env
NODE_ENV=production
PORT=3002
```

These are set in the docker-compose.yml file for the backend service.

## Testing the Configuration

To verify the port configuration is working correctly:

1. **Start Docker Services**
   ```bash
   docker-compose up --build
   ```

2. **Test Frontend Access**
   ```bash
   curl http://localhost:8080
   ```

3. **Test Backend Direct Access**
   ```bash
   curl http://localhost:3002/api/test-translation
   ```

4. **Test Backend via Frontend Proxy**
   ```bash
   curl http://localhost:8080/api/test-translation
   ```

All of these should work without any port conflicts.# Docker Port Configuration and Service Communication

This document explains how ports are configured in the Docker environment and how services communicate with each other.

## Port Configuration

### Docker Compose Services ([docker-compose.yml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker-compose.yml))

1. **Frontend Service**
   - External port: 8080
   - Internal port: 80 (Nginx)
   - Mapping: `"8080:80"`
   - Access URL: http://localhost:8080

2. **Backend Service**
   - External port: 3002
   - Internal port: 3002 (Node.js)
   - Mapping: `"3002:3002"`
   - Access URL: http://localhost:3002

### Development Environment Ports

1. **Frontend Development**
   - Port: 5175
   - Configured in [packages/frontend/vite.config.ts](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/packages/frontend/vite.config.ts)
   - Access URL: http://localhost:5175

2. **Backend Development**
   - Port: 3002
   - Configured in [packages/backend/src/server.ts](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/packages/backend/src/server.ts)
   - Access URL: http://localhost:3002

## Service Communication

### In Docker Environment

1. **Frontend to Backend Communication**
   - Nginx is configured with an upstream backend service:
     ```
     upstream backend {
         server lingua-backend-service:3002;
     }
     ```
   - API requests are proxied through Nginx:
     ```
     location /api/ {
         proxy_pass http://backend;
         # ... proxy headers
     }
     ```
   - This means when you access http://localhost:8080/api/..., Nginx forwards the request to the backend service running on port 3002.

2. **Container Names**
   - Frontend container: `lingua-frontend`
   - Backend container: `lingua-backend`
   - These names are used for service discovery within the Docker network.

### In Development Environment

1. **Frontend to Backend Communication**
   - Vite proxy configuration in [packages/frontend/vite.config.ts](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/packages/frontend/vite.config.ts):
     ```typescript
     proxy: {
       '/api': {
         target: 'http://localhost:3002',  // Docker backend port
         changeOrigin: true,
         secure: false,
       }
     }
     ```
   - This means when you access http://localhost:5175/api/... during development, Vite proxies the request to http://localhost:3002.

## No Port Conflicts

With this configuration, there are no port conflicts:

1. **Docker Environment**
   - Port 8080: Frontend Nginx server
   - Port 3002: Backend Node.js server

2. **Development Environment**
   - Port 5175: Frontend Vite development server
   - Port 3002: Backend Node.js server

## Accessing Services

### Docker Environment
- Frontend Application: http://localhost:8080
- Backend API Direct Access: http://localhost:3002/api/...
- Backend API via Frontend Proxy: http://localhost:8080/api/...

### Development Environment
- Frontend Application: http://localhost:5175
- Backend API Direct Access: http://localhost:3002/api/...
- Backend API via Frontend Proxy: http://localhost:5175/api/...

## Environment Variables

The backend uses the following environment variables for port configuration:
```env
NODE_ENV=production
PORT=3002
```

These are set in the docker-compose.yml file for the backend service.

## Testing the Configuration

To verify the port configuration is working correctly:

1. **Start Docker Services**
   ```bash
   docker-compose up --build
   ```

2. **Test Frontend Access**
   ```bash
   curl http://localhost:8080
   ```

3. **Test Backend Direct Access**
   ```bash
   curl http://localhost:3002/api/test-translation
   ```

4. **Test Backend via Frontend Proxy**
   ```bash
   curl http://localhost:8080/api/test-translation
   ```

All of these should work without any port conflicts.
