# Scripts — Datashare

## `setup-database.sh`

Prépare la **base de données** après clone : installe les dépendances Composer côté backend, assure `.env` / clé d’application, exécute les **migrations**.

**Prérequis** : PHP 8.3+, Composer, fichier `datashare-backend/.env` correct pour votre SGBD (SQLite fichier ou variables `DB_*` pour MySQL/PostgreSQL).

Depuis la racine du dépôt :

```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

Avec données de démo (utilisateur `test@example.com` / `password` si `DatabaseSeeder` inchangé) :

```bash
./scripts/setup-database.sh --seed
```

**Risques** : `migrate` sur une base existante applique uniquement les migrations en attente ; en cas de doute sur un environnement partagé, faire une sauvegarde avant (voir `Docs/MAINTENANCE.md`).

## Déploiement Docker (optionnel)

Le fichier `datashare-backend/compose.yaml` (Laravel Sail) permet de monter **MySQL**, Redis, etc. Consultez la [documentation Sail](https://laravel.com/docs/sail) pour `./vendor/bin/sail up` après configuration `.env`.
