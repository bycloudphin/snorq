FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using npm install since there's no lock file)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - using caddy to serve static files
FROM caddy:2-alpine AS production

# Copy built files
COPY --from=builder /app/dist /srv

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port
EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
