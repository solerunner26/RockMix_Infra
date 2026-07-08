# Use official Node.js runtime as parent image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built code and required resources
COPY dist ./dist
COPY public ./public
COPY data ./data
COPY dbInit.ts ./dbInit.ts
COPY server.ts ./server.ts
COPY siteContent.json ./siteContent.json

# Expose port 7860 (Hugging Face Spaces default port)
EXPOSE 7860

# Set environment variables
ENV PORT=7860
ENV NODE_ENV=production
ENV SESSION_SECRET=rockmix-infra-secure-secret-2026

# Start the server
CMD ["node", "dist/server.cjs"]
