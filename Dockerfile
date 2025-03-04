# Use Node.js 20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build
RUN npm run server:build

# Expose the port the app runs on
EXPOSE 8080

# Create volume for uploads
VOLUME ["/app/uploads"]

# Create volume for database
VOLUME ["/app/prisma"]

# Command to run the application
CMD ["npm", "run", "server:prod"]