# Build stage
FROM node:20-alpine AS builder

# Install build dependencies for native modules (like bcrypt)
RUN apk add --no-cache openssl openssl-dev python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma generate && npm run build

# Remove development dependencies to keep image small
RUN npm prune --production

# Production stage
FROM node:20-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

# Node.js memory optimization for Railway/resource-constrained environments
# Increased slightly for better stability
ENV NODE_OPTIONS="--max-old-space-size=384"

ENTRYPOINT ["./docker-entrypoint.sh"]
