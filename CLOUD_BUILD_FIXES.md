# Cloud Build Deployment Fixes

## Issue Analysis

The Cloud Build was failing with the error:
```
COPY failed: no source files were specified
```

This was happening because Cloud Build was trying to use a Dockerfile with this instruction:
```
COPY ./packages/frontend/package*.json ./
```

But in the context where the Dockerfile was being run, the path `./packages/frontend/package*.json` didn't exist.

## Root Cause

1. **Historical Dockerfile**: An older version of [frontend.Dockerfile](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/frontend-k8s.Dockerfile) was moved to the repository root with incorrect paths
2. **Commit Mismatch**: Cloud Build was using an older commit that contained this problematic Dockerfile
3. **Path Structure**: The Dockerfile expected a different directory structure than what actually existed

## Fixes Applied

1. **Created Correct Root Dockerfile**:
   - Created a new [frontend.Dockerfile](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/frontend-k8s.Dockerfile) at the repository root with correct paths
   - This Dockerfile properly copies files from `packages/frontend/` directory

2. **Updated Cloud Build Configuration**:
   - Modified [cloudbuild.yaml](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/cloudbuild.yaml) to explicitly use the root [frontend.Dockerfile](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/frontend-k8s.Dockerfile)
   - Ensured the build context is correct (repository root)

3. **Proper Path References**:
   - The new Dockerfile correctly references:
     - `package*.json ./` (root package files)
     - `packages/frontend/package*.json ./packages/frontend/` (frontend package files)
   - Uses proper workspace commands for building

## New Dockerfile Structure

The new [frontend.Dockerfile](file:///c%3A/Users/Lenovo/Lingua-phone-monorepo/docker/frontend-k8s.Dockerfile) at the root:

```dockerfile
# Stage 1: Build the frontend
FROM node:20 AS build
WORKDIR /app

# Copy only the package.json files first (for caching)
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build frontend
RUN npm run build --workspace=frontend

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Verification Steps

1. **Commit Changes**: Ensure all changes are committed to the repository
2. **Trigger Cloud Build**: Run the build process to verify the fix
3. **Check Build Logs**: Confirm that the COPY commands execute successfully
4. **Verify Deployment**: Check that the frontend deploys correctly to GKE

## Future Considerations

1. **Consistent Dockerfile Strategy**: Consider whether to keep Dockerfiles in the root or in the docker/ directory
2. **Build Context**: Always verify that the build context matches the Dockerfile's expectations
3. **Path References**: Ensure all COPY paths are correct relative to the build context
