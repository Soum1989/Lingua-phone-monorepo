# Port Configuration for Docker Environment

This document explains the port configuration for the Docker environment to avoid conflicts.

## Current Port Mapping

### Docker Compose Services

1. **Frontend Service**
   - External port: 8080
   - Internal port: 80
   - Access URL: http://localhost:8080

2. **Backend Service**
   - External port: 3002
   - Internal port: 3002
   - Access URL: http://localhost:3002

### How It Works

- The frontend Nginx server runs on port 80 internally and is mapped to port 8080 on the host
- The backend Node.js server runs on port 3002 internally and is mapped to port 3002 on the host
- Nginx is configured to proxy API requests to the backend service

### Nginx Configuration

In the Docker environment, the frontend's Nginx configuration proxies API requests to the backend:

```
location /api/ {
    proxy_pass http://backend:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

This means when you access http://localhost:8080 in your browser:
- Static frontend files are served directly by Nginx
- API requests (to /api/*) are automatically forwarded to the backend service

### No Port Conflicts

With this configuration, there are no port conflicts:
- Port 8080 is used exclusively by the frontend Nginx server
- Port 3002 is used exclusively by the backend Node.js server

### Accessing Services

1. **Frontend Application**: http://localhost:8080
2. **Backend API**: http://localhost:3002/api/...
3. **Backend API via Frontend Proxy**: http://localhost:8080/api/...

### Development vs Production

Note that this Docker configuration differs from the development environment:
- Development frontend: http://localhost:5175
- Development backend: http://localhost:3002

The Docker environment uses different ports to avoid conflicts with development servers that might be running simultaneously.
