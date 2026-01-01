FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time arguments for Vite env vars
ARG VITE_API_URL
ARG VITE_WS_URL
ARG VITE_APP_NAME
ARG VITE_APP_DESCRIPTION
ARG VITE_GOOGLE_CLIENT_ID

# Set them as environment variables for the build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_DESCRIPTION=$VITE_APP_DESCRIPTION
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

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
