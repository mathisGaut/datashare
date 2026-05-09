#!/usr/bin/env bash
# Installation / mise à jour du schéma base de données — Datashare (Laravel).
# Usage : depuis la racine du dépôt — ./scripts/setup-database.sh [--seed]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="${ROOT}/datashare-backend"

if [[ ! -d "${BACKEND}" ]]; then
  echo "Erreur : dossier datashare-backend introuvable (${BACKEND})." >&2
  exit 1
fi

cd "${BACKEND}"

if [[ ! -f .env ]]; then
  echo "Copie de .env.example vers .env …"
  cp .env.example .env
  php artisan key:generate --ansi
  echo "Éditez .env (DB_*) puis relancez ce script si vous changez de SGBD." >&2
fi

echo "→ composer install (ignore erreurs si déjà fait)"
composer install --no-interaction --prefer-dist

echo "→ php artisan migrate"
php artisan migrate --force

if [[ "${1:-}" == "--seed" ]]; then
  echo "→ php artisan db:seed"
  php artisan db:seed --force
fi

echo "Terminé. Vérifier database.sqlite ou la connexion MySQL/PostgreSQL selon .env."
