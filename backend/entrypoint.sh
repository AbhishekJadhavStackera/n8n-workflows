#!/usr/bin/env sh
set -e

# Run DB sync & client generation at container start.
# By default we run `prisma db push` (no shadow DB necessary).
# If you want migrations (production), set PRISMA_MIGRATE=deploy to run `prisma migrate deploy`.

if command -v npx >/dev/null 2>&1; then
  echo "[entrypoint] running: npx prisma db push --accept-data-loss"
  if ! npx prisma db push --accept-data-loss; then
    echo "[entrypoint] warning: prisma db push exited with non-zero code"
  fi

  echo "[entrypoint] running: npx prisma generate"
  if ! npx prisma generate; then
    echo "[entrypoint] warning: prisma generate exited with non-zero code"
  fi
else
  echo "[entrypoint] npx not found, skipping prisma steps"
fi

# Exec the provided CMD (api or worker)
exec "$@"
