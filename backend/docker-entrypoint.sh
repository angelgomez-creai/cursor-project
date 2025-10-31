#!/bin/sh
# Docker entrypoint script (optimized with sh instead of bash)
set -e

echo "🚀 Starting E-commerce Backend..."
echo "Environment: ${ENVIRONMENT:-development}"
echo "Debug: ${DEBUG:-false}"

# Initialize database if needed (only for SQLite, PostgreSQL uses migrations)
if [ "${DATABASE_URL#sqlite}" != "$DATABASE_URL" ]; then
    if [ ! -f "/app/data/ecommerce.db" ]; then
        echo "📦 Initializing SQLite database..."
        python -c "from infrastructure.database.sqlalchemy.session import init_database; init_database()"
        echo "✅ Database initialized"
    fi
fi

# Execute the main command
exec "$@"

