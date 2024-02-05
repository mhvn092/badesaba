# Stage 1: Install dependencies and build application
FROM node:18-slim as development

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build:auth

# Stage 2: Create production image
FROM node:18-slim as production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose port
EXPOSE ${PORT}
EXPOSE 5001

# Create a non-root user
USER node

# Set working directory
WORKDIR /app

# Copy build output from the development stage
COPY --from=development /app/dist/apps/auth ./dist

# Copy package.json
COPY --from=development /app/package.json ./

# Copy package.json
COPY --from=development /app/yarn.lock ./

# Install only production dependencies
RUN yarn install --production=true

# Command to run the application
CMD ["node", "dist/apps/accounting/main"]
