#!/bin/bash
# Первичная настройка VPS (Ubuntu). Запускать НА СЕРВЕРЕ после ssh root@IP
set -e
echo "=== Обновление и установка Node, Nginx ==="
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx
echo "Node: $(node -v)"

echo "=== Папка сайта ==="
mkdir -p /var/www/cheremushki/.data
chmod 755 /var/www/cheremushki

echo "=== Готово. Дальше залейте файлы с Mac и создайте .env.local ==="
