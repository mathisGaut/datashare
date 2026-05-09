# Datashare

Prototype de **plateforme de transfert sécurisé de fichiers** pour freelances et petites structures : compte utilisateur (Laravel Sanctum), téléversement, gestion des dépôts et **lien de téléchargement** à expiration.

## Démarrage rapide

### Prérequis

PHP 8.3+, Composer, Node.js 20+, npm.

### 1. Backend (API)

```bash
cd datashare-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed   # optionnel — utilisateur démo
php artisan serve
```

API : `http://127.0.0.1:8000/api` (ajuster `APP_URL` dans `.env` pour les URLs de téléchargement).

### 2. Frontend (SPA)

```bash
cd datashare-frontend
npm install
npm run dev
```

Configurer l’URL de l’API dans `datashare-frontend/src/services/api.js` (`baseURL`), typiquement `http://127.0.0.1:8000/api` si vous utilisez `php artisan serve`.

### 3. Tests backend

```bash
cd datashare-backend
composer test
# Couverture (PCOV ou Xdebug requis) :
php artisan test --coverage --min=70
```

---

## Documentation du projet

| Document | Description |
| --- | --- |
| [Docs/README.md](Docs/README.md) | Architecture, stack, installation détaillée, variables d’environnement |
| [Docs/API_CONTRACT.md](Docs/API_CONTRACT.md) | Contrat d’interface REST (corps, réponses, erreurs) |
| [Docs/DATA_MODEL.md](Docs/DATA_MODEL.md) | MCD et schéma physique (`users`, `files`, Sanctum) |
| [Docs/MVP_JUSTIFICATION.md](Docs/MVP_JUSTIFICATION.md) | Périmètre MVP et choix technologiques |
| [Docs/AI_USAGE.md](Docs/AI_USAGE.md) | Traçabilité de l’usage de l’IA dans le projet |
| [Docs/TESTING.md](Docs/TESTING.md) | Plan de tests, couverture, commandes |
| [Docs/SECURITY.md](Docs/SECURITY.md) | Auth, policies, audits |
| [Docs/PERF.md](Docs/PERF.md) | Scénarios k6 |
| [Docs/MAINTENANCE.md](Docs/MAINTENANCE.md) | Exploitation et sauvegardes |

## Structure du dépôt

```text
datashare-backend/    # API Laravel 13 (Sanctum)
datashare-frontend/   # React 19 + Vite + Tailwind
Docs/                 # Documentation technique et qualité
perf/                 # Scripts k6 (performance)
```

## Licence

Projet de démonstration / formation — voir les licences des dépendances dans chaque sous-projet.
