#!/bin/sh
set -e
# Apply pending Drizzle SQL migrations (waits for MySQL), then the idempotent sample seed.
node dist/migrate.js
if [ "${RUN_SEED:-true}" = "true" ]; then node dist/seed.js; fi
exec "$@"
