# Port Configuration Fixes

This document summarizes the changes made to fix port configuration issues in the Docker and GKE environments.

## Issues Identified

1. **Backend Port Mismatch**: The backend service in docker-compose.yml was mapping external port 3002 to internal port 8080, which was inconsistent with the actual backend application that runs on port 3002.

2. **Default Port in Server**: The backend server.ts file was defaulting to port 8080 instead of 3002.

3. **Node.js Version**: Both Dockerfiles were using Node.js 18, but the project requires Node.js 20 or higher for Vite ES modules support.

## Fixes Implemented

### 1. Updated docker-compose.yml

Changed the backend service port mapping from:
```yaml
ports:
  - "3002:8080"
```

To:
```yaml
ports:
  - "3002:3002"
```

Also added explicit PORT environment variable:
```yaml
environment:
  - NODE_ENV=production
  - PORT=3002
```

### 2. Updated Backend Server Configuration

Changed the default port in [packages/backend/src/server.ts](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/packages/backend/src/server.ts) from:
```typescript
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
```

To:
```typescript
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
```

### 3. Updated Dockerfiles

Updated both Dockerfiles to use Node.js 20 instead of Node.js 18:

**Backend Dockerfile**:
```dockerfile
# Use Node.js 20 as the base image (required for Vite ES modules support)
FROM node:20
```

**Frontend Dockerfile**:
```dockerfile
# Build stage
FROM node:20 AS build
```

### 4. Verified Nginx Configuration

Confirmed that the nginx configuration in [docker/nginx.conf](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/nginx.conf) correctly proxies API requests to port 3002:
```nginx
upstream backend {
    server lingua-backend-service:3002;
}
```

### 5. Updated GKE Deployment

Updated the GKE backend deployment to explicitly set the PORT environment variable and ensure container port is 3002:
```yaml
env:
- name: PORT
  value: "3002"
```

## Current Port Configuration

### Docker Environment

1. **Frontend Service**
   - External port: 8080
   - Internal port: 80 (Nginx)
   - Access URL: http://localhost:8080

2. **Backend Service**
   - External port: 3002
   - Internal port: 3002 (Node.js)
   - Access URL: http://localhost:3002

### GKE Environment

1. **Frontend Service**
   - Service port: 80
   - Type: LoadBalancer (external IP assigned by GKE)

2. **Backend Service**
   - Service port: 3002
   - Type: ClusterIP (internal access only)

## No More Port Conflicts

With these changes:
- The frontend runs on port 8080 (Docker) or gets an external IP (GKE)
- The backend consistently runs on port 3002 in all environments
- There are no port conflicts between services
- The configuration is consistent between Docker and GKE environments

## Testing the Configuration

To test the updated configuration:

1. **Build and start services**:
   ```bash
   docker-compose up --build
   ```

2. **Access the frontend**:
   Open http://localhost:8080 in your browser

3. **Test backend API directly**:
   ```bash
   curl http://localhost:3002/api/test
   ```

4. **Test backend API through frontend proxy**:
   ```bash
   curl http://localhost:8080/api/test
   ```

Both backend access methods should work correctly without any port conflicts.
