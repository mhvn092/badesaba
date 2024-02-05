# Stage 1: Install dependencies and build application
FROM node:18-slim as development

# Install and configure pnpm
RUN npm install -g pnpm
RUN npm config set registry http://registry.npmjs.org/

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build:auth

# Stage 2: Create production image
FROM node:18-slim as production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE ${PORT}

# Create a non-root user
USER node

# Set working directory
WORKDIR /app

# Copy build output from the development stage
COPY --from=development /app/dist/apps/auth ./dist

# Copy package.json and package-lock.json
COPY --from=development /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Command to run the application
CMD ["node", "dist/apps/accounting/main"]
