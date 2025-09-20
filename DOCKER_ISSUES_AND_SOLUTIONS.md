# Docker Issues and Solutions

This document explains the issues identified with the Docker configuration and how to fix them.

## Issues Identified

### 1. Backend Container Port Configuration
From the container logs, we can see that the backend container is showing `3002:8080` in the port mapping, which indicates a discrepancy between the configuration in the docker-compose.yml file and what's actually running.

### 2. Nginx Proxy Issue
The frontend Nginx is returning 404 errors for all API requests (`/api/chat`, `/api/tts`, `/api/languages`, `/api/translate`), which means the proxy configuration isn't working properly.

### 3. Backend Dockerfile Issue
The backend Dockerfile was trying to run `node dist/index.js` but the package.json shows it should be `node dist/server.js`.

## Fixes Implemented

### 1. Corrected Backend Dockerfile
Updated the backend Dockerfile to run the correct entry point:
```dockerfile
# Start the application
CMD ["node", "packages/backend/dist/server.js"]
```

### 2. Verified docker-compose.yml Configuration
The docker-compose.yml file has the correct port configuration:
```yaml
backend:
  ports:
    - "3002:3002"
```

### 3. Verified Nginx Configuration
The nginx configuration has the correct proxy setup:
```nginx
upstream backend {
    server lingua-backend-service:3002;
}

location /api/ {
    proxy_pass http://backend;
    # ... proxy headers
}
```

## How to Fix the Running Containers

Since there seems to be an issue with the PowerShell terminal, here are the steps to fix the containers:

### 1. Stop and Remove Containers
```bash
docker stop lingua-frontend lingua-backend
docker rm lingua-frontend lingua-backend
```

### 2. Build and Start Containers
```bash
docker-compose up --build -d
```

### 3. Verify Containers are Running
```bash
docker ps
```

You should see output similar to:
```
CONTAINER ID   IMAGE               COMMAND                  PORTS                    NAMES
62cd088d1c33   lingua-frontend     "/docker-entrypoint.…"   0.0.0.0:8080->80/tcp     lingua-frontend
ce0c45b65382   lingua-backend      "docker-entrypoint.s…"   0.0.0.0:3002->3002/tcp   lingua-backend
```

## Testing the Fix

### 1. Test Frontend Access
Open your browser and go to http://localhost:8080

### 2. Test Backend Direct Access
```bash
curl http://localhost:3002/api/test-translation
```

### 3. Test Backend via Frontend Proxy
```bash
curl http://localhost:8080/api/test-translation
```

All of these should work without returning 404 errors.

## Common Issues and Troubleshooting

### 1. If Containers Still Show Incorrect Port Mapping
- Make sure you're using the latest docker-compose.yml file
- Remove any cached Docker images:
  ```bash
  docker rmi lingua-frontend lingua-backend
  ```

### 2. If Nginx Proxy Still Not Working
- Check that the nginx.conf file is correctly copied to the container
- Verify that the backend service name matches in both docker-compose.yml and nginx.conf

### 3. If Backend Container Fails to Start
- Check the backend container logs:
  ```bash
  docker logs lingua-backend
  ```
- Ensure all environment variables are correctly set

## Expected Behavior After Fix

1. Frontend should be accessible at http://localhost:8080
2. Backend should be accessible directly at http://localhost:3002
3. API requests through the frontend proxy (http://localhost:8080/api/...) should work
4. Translation, TTS, and chat endpoints should return proper responses instead of 404 errors

The logs should show successful API requests instead of the "open() '/usr/share/nginx/html/api/...' failed" errors.
