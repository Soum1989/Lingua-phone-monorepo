# Use Node.js 20 as the base image (required for Vite ES modules support)
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the backend
RUN npm run build --workspace=backend

# Expose the port the app runs on
EXPOSE 3002

# Start the application
CMD ["node", "packages/backend/dist/server.js"]