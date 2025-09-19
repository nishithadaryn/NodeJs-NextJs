# Use official Node.js runtime
FROM node:21-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app (including src/tests)
COPY . .

# Ensure ES modules are recognized
ENV NODE_OPTIONS="--experimental-specifier-resolution=node"

# Expose the backend port
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]
