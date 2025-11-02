#!/bin/sh
echo "Waiting for Postgres to start..."

while ! pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" >/dev/null 2>&1; do
  echo "Bank not ready yet, waiting..."
  sleep 2
done

echo "Database ready! Running migrations..."
yarn prisma migrate deploy

echo "Starting application..."
node dist/src/main.js
