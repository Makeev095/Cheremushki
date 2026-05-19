#!/usr/bin/env bash
# Сборка папки для загрузки на VPS / reg.ru (Node.js)
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ npm ci && npm run build"
npm ci
npm run build

OUT="deploy-bundle"
rm -rf "$OUT"
mkdir -p "$OUT"

echo "→ Копирование standalone-сервера"
cp -r .next/standalone/* "$OUT/"
mkdir -p "$OUT/.next"
cp -r .next/static "$OUT/.next/static"
cp -r public "$OUT/public"

mkdir -p "$OUT/.data"

cat > "$OUT/start.sh" << 'EOF'
#!/bin/sh
cd "$(dirname "$0")"
export NODE_ENV=production
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
exec node server.js
EOF
chmod +x "$OUT/start.sh"

if [ -f .env.example ]; then
  cp .env.example "$OUT/.env.example"
fi

echo ""
echo "Готово: папка $(pwd)/$OUT"
echo "На сервере: скопируйте $OUT, создайте .env.local, запустите ./start.sh"
