#!/bin/sh
set -e

echo "Waiting for database to be ready..."

# Retry loop for database connection
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if npx prisma migrate deploy 2>/dev/null; then
        echo "Database migration successful!"
        
        # Run seed script (compiled JS version)
        echo "Running database seed..."
        if [ -f "dist/prisma/seed.js" ]; then
            node dist/prisma/seed.js || echo "Seed script completed (may have already seeded)"
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
    echo "Warning: Could not run migrations after $MAX_RETRIES attempts. Starting server anyway..."
fi

echo "Starting server..."
exec node dist/server.js

