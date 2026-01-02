#!/bin/sh

echo "=== SNORQ Backend Container Starting ==="
echo "Timestamp: $(date)"
echo "Environment: ${NODE_ENV:-not set}"
echo "Port: ${PORT:-3000}"

# Check critical environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  WARNING: DATABASE_URL is not set!"
    echo "Starting server anyway - database operations will fail"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  WARNING: JWT_SECRET is not set!"
fi

# Try to run migrations with better error handling
if [ -n "$DATABASE_URL" ]; then
    echo ""
    echo "=== Running Database Migrations ==="
    
    # Retry loop for database connection
    MAX_RETRIES=10
    RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        echo "Attempt $((RETRY_COUNT + 1))/$MAX_RETRIES: Running prisma migrate deploy..."
        
        if npx prisma migrate deploy 2>&1; then
            echo "✅ Database migrations completed successfully!"
            
            # Run seed script if it exists
            if [ -f "dist/prisma/seed.js" ]; then
                echo "Running database seed..."
                node dist/prisma/seed.js 2>&1 || echo "Seed completed (may already be seeded)"
            fi
            
            break
        else
            RETRY_COUNT=$((RETRY_COUNT + 1))
            if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
                echo "Database not ready, waiting 3 seconds..."
                sleep 3
            fi
        fi
    done
    
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "⚠️  Could not run migrations after $MAX_RETRIES attempts"
        echo "Starting server anyway..."
    fi
else
    echo "Skipping migrations (no DATABASE_URL)"
fi

echo ""
echo "=== Starting SNORQ API Server ==="
echo "Node version: $(node --version)"
echo "Memory limit: ${RAILWAY_MEMORY_LIMIT_MB:-unknown}MB"

# Start the server
exec node dist/server.js
