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

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remove development dependencies to keep image small
RUN npm prune --production

# Production stage
FROM node:20-alpine AS production

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl

WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
# Copy built files
COPY --from=builder /app/dist ./dist
# Copy package.json (needed for scripts/metadata)
COPY --from=builder /app/package.json ./
# Copy Prisma schema (needed for some Prisma operations)
COPY --from=builder /app/prisma ./prisma

# Copy startup script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Node.js memory optimization for Railway/resource-constrained environments
# Increased slightly for better stability
ENV NODE_OPTIONS="--max-old-space-size=384"

EXPOSE 3000

# Use the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
