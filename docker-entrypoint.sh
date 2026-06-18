#!/bin/sh
set -e

API_URL="${VITE_API_BASE_URL:-http://localhost:8000/api/v1}"

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = window.__ENV__ || {};
window.__ENV__.API_BASE_URL = "${API_URL}";
EOF

echo "Generated env-config.js with API_BASE_URL=${API_URL}"

exec nginx -g "daemon off;"
