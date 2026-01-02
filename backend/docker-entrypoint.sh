#!/bin/sh
set -e

echo "=== SNORQ Backend Starting ==="
echo "Environment: $NODE_ENV"
echo "Port: $PORT"
echo "Timestamp: $(date)"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set!"
    echo "Starting server anyway (will fail on DB operations)..."
    exec node dist/server.js
fi

echo "DATABASE_URL is configured"
echo "Waiting for database to be ready..."

# Retry loop for database connection
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if npx prisma migrate deploy 2>&1; then
        echo "Database migration successful!"
        
        # Run seed script (compiled JS version)
        echo "Running database seed..."
        if [ -f "dist/prisma/seed.js" ]; then
            node dist/prisma/seed.js 2>&1 || echo "Seed script completed (may have already seeded)"
        else
            echo "Seed script not found, skipping..."
        fi
        
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "Database not ready, retry $RETRY_COUNT/$MAX_RETRIES..."
        sleep 2
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "WARNING: Could not run migrations after $MAX_RETRIES attempts."
    echo "Starting server anyway - some features may not work..."
fi

echo "=== Starting SNORQ API Server ==="
exec node dist/server.js
