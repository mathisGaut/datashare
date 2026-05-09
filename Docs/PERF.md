# Performance — Datashare

Objectif : mesurer rapidement les parcours **upload** et **téléchargement**, les temps de réponse API et collecter des métriques reproductibles avec **k6**.

## Prérequis

- [k6](https://k6.io/docs/getting-started/installation/) installé (`k6 version`).
- API Laravel joignable (ex. `php artisan serve` → `http://127.0.0.1:8000`).
- Compte utilisateur présent en base (par défaut le seeder crée `test@example.com` avec le mot de passe **`password`** — voir `DatabaseSeeder` / `UserFactory`).

## Script fourni

Fichier : [`perf/upload-test.js`](perf/upload-test.js)  
Fixture : [`perf/fixtures/sample-upload.txt`](perf/fixtures/sample-upload.txt)

Depuis le dossier `perf/` :

```bash
cd perf
k6 run upload-test.js
```

Depuis la racine du dépôt (chemin du fichier fixture explicite) :

```bash
FIXTURE_PATH=perf/fixtures/sample-upload.txt k6 run perf/upload-test.js
```

Variables d’environnement utiles :

| Variable | Défaut | Description |
| --- | --- | --- |
| `BASE_URL` | `http://localhost:8000` | Origine du serveur Laravel (sans `/api`) |
| `EMAIL` | `test@example.com` | Compte pour `POST /api/login` |
| `PASSWORD` | `password` | Mot de passe du compte |
| `FIXTURE_PATH` | `./fixtures/sample-upload.txt` | Chemin du fichier uploadé (relatif au répertoire de lancement de k6) |

Exemple :

```bash
cd perf
BASE_URL=http://127.0.0.1:8000 EMAIL=test@example.com PASSWORD=password k6 run upload-test.js
```

Le scénario :

1. Obtient un token (`POST /api/login`).
2. Upload un petit fichier (`POST /api/files`).
3. Appelle l’URL `download_url` renvoyée par l’API (`GET` public).

Métriques personnalisées exportées par le script :

- `upload_duration_ms`, `download_duration_ms` (tendances)
- `upload_failures`, `download_failures` (compteurs)

Seuils par défaut dans le script : taux d’échec HTTP inférieur à 5 %, p95 upload inférieur à 5 s, p95 download inférieur à 3 s — à ajuster selon la machine et la taille des fichiers.

## Logs Laravel en phase de perf

Pour observer requêtes lentes ou erreurs pendant un run k6 :

```bash
cd datashare-backend
php artisan pail
# ou
tail -f storage/logs/laravel.log
```

Niveau de log : `LOG_LEVEL=debug` dans `.env` uniquement sur un environnement de test (pas en production).

## Métriques serveur (optionnel)

- **Laravel** : route de santé `GET /up` (framework), endpoint métier `GET /api/test`.
- **Système** : surveiller CPU, mémoire et I/O disque pendant les montées en charge (`htop`, Activity Monitor).
- Pour aller plus loin : exposer métriques Prometheus, APM (Datadog, New Relic), ou logs centralisés (ELK, Loki).

## Interprétation rapide

- Si `upload_duration_ms` augmente linéairement avec les VUs : possible goulot disque ou CPU ; augmenter la taille du worker PHP-FPM / ajuster `post_max_size` et `upload_max_filesize` si gros fichiers.
- Si les échecs sont sur `login` : vérifier seed utilisateur, URL de base et CORS si navigateur (ici k6 n’utilise pas CORS comme un navigateur classique pour les simples GET/POST).

## Voir aussi

- [MAINTENANCE.md](MAINTENANCE.md) — logs et supervision courante.
