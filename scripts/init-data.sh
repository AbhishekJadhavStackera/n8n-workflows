#!/bin/sh
set -e

: "${POSTGRES_NON_ROOT_USER:?}"
: "${POSTGRES_NON_ROOT_PASSWORD:?}"
: "${POSTGRES_DB:?}"

echo "Setting up database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
-- Create user if not exists (with CREATEDB optional removed to keep privileges minimal)
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${POSTGRES_NON_ROOT_USER}') THEN
    CREATE ROLE ${POSTGRES_NON_ROOT_USER} WITH LOGIN PASSWORD '${POSTGRES_NON_ROOT_PASSWORD}';
  END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE ${POSTGRES_DB}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${POSTGRES_DB}')\gexec

-- Make non-root user owner and grant necessary schema privileges
ALTER DATABASE ${POSTGRES_DB} OWNER TO ${POSTGRES_NON_ROOT_USER};
GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_NON_ROOT_USER};
GRANT USAGE, CREATE ON SCHEMA public TO ${POSTGRES_NON_ROOT_USER};

-- Ensure uuid extension exists (runs as superuser)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL

echo "Database setup complete."
