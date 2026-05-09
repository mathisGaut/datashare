# Performance — Datashare

Ce document couvre la **performance backend** (k6), le **budget frontend** (bundle, navigateur), un **journal de métriques** indicatif et des **pistes d’optimisation**. Il doit rester **cohérent** avec le code (`validation max 10 Mo` upload, scripts dans `perf/`).

---

## 1. Backend — tests de charge (k6)

### Prérequis

- [k6](https://k6.io/docs/getting-started/installation/) installé (`k6 version`).
- API Laravel joignable (ex. `php artisan serve` → `http://127.0.0.1:8000`).
- Compte utilisateur présent en base (par défaut le seeder crée `test@example.com` avec le mot de passe **`password`** — voir `DatabaseSeeder` / `UserFactory`).

### Script fourni

Fichier : [`perf/upload-test.js`](../perf/upload-test.js)  
Fixture : [`perf/fixtures/sample-upload.txt`](../perf/fixtures/sample-upload.txt)

Depuis le dossier `perf/` :

```bash
cd perf
k6 run upload-test.js
```

Depuis la racine du dépôt :

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

### Logs Laravel en phase de perf

```bash
cd datashare-backend
php artisan pail
# ou
tail -f storage/logs/laravel.log
```

Niveau de log : `LOG_LEVEL=debug` dans `.env` uniquement sur un environnement de test (pas en production).

### Métriques serveur (optionnel)

- **Laravel** : `GET /up` (framework), `GET /api/test`.
- **Système** : CPU, mémoire, I/O disque pendant les runs (`htop`, Activity Monitor).
- **Évolution** : Prometheus, APM (Datadog, New Relic), logs centralisés (ELK, Loki).

### Interprétation rapide (backend)

- Si `upload_duration_ms` monte avec les VUs : goulot disque ou CPU ; ajuster PHP-FPM, `post_max_size`, `upload_max_filesize`.
- Échecs sur `login` : seed utilisateur, `BASE_URL`, CORS si navigateur (k6 ne reproduit pas tout le navigateur).

---

## 2. Frontend — budget de performance (bundle)

### Mesure du build de production

Dans `datashare-frontend` :

```bash
npm run build
```

Vite affiche les tailles **brutes** et **gzip** des assets. Exemple de sortie **à titre indicatif** (les hash de fichiers changent à chaque build) :

| Asset (prod) | Taille | gzip (indicatif) |
| --- | --- | --- |
| `index.html` | ~0,5 ko | ~0,3 ko |
| CSS principal | ~16 ko | ~4 ko |
| JS principal (bundle client) | ~292 ko | ~94 ko |

**Ordre de grandeur actuel** : le JavaScript bundlé domine le budget ; le gzip réduit fortement le transfert réseau.

### Bonnes pratiques pour la soutenance

- Conserver une **capture d’écran** de la sortie `npm run build` dans les annexes ou le rapport.
- Pour aller plus loin : `npm install --save-dev rollup-plugin-visualizer` (ou équivalent Vite) pour un **treemap** des modules — utile pour identifier les grosses dépendances (`lucide-react`, etc.).

### Lighthouse (Chrome DevTools)

1. `npm run build` puis `npm run preview` (servir le build localement).
2. Ouvrir l’URL affichée dans Chrome → DevTools → **Lighthouse**.
3. Catégories utiles : **Performance**, **Accessibility**, **Best Practices** (pas besoin de SEO maximal pour une SPA derrière auth).

Noter les scores et 2–3 recommandations affichées (images, cache, LCP). Pour une démo **localhost**, certains scores peuvent être artificiellement bas ; l’important est de **montrer la démarche** et le budget bundle ci-dessus.

---

## 3. Journal des métriques clés (template)

Recopier ce tableau dans un rapport ou une annexe et **le remplir** après chaque campagne de mesure (date + environnement identiques pour comparer).

### API — temps de réponse (indicatif)

| Date | Environnement | Endpoint / scénario | p50 / moyenne | p95 | Notes |
| --- | --- | --- | --- | --- | --- |
| *à remplir* | ex. MacBook M1, `php artisan serve` | `POST /api/login` | | | |
| *à remplir* | idem | `POST /api/files` (fichier ~100 ko) | | | sortie k6 |
| *à remplir* | idem | `GET /api/files/download/{token}` | | | |

### Transferts — tailles

| Contexte | Taille fichier test | Résultat attendu |
| --- | --- | --- |
| Upload max MVP | 10 Mo (limite validation) | 201 si auth ; 422 si dépassement |
| Fixture k6 | `sample-upload.txt` (quelques octets) | Mesure surtout la latence, pas le débit |

### Frontend — bundle

| Date | `npm run build` | JS gzip (ko) | CSS gzip (ko) | Commentaire |
| --- | --- | --- | --- | --- |
| 2026-05-09 | Vite 8 | ~94 | ~4 | Valeurs indicatives ; re-générer après changement de deps |

---

## 4. Analyse — optimisations possibles

| Zone | Constat | Action envisageable | Effort |
| --- | --- | --- | --- |
| Frontend | Bundle JS ~94 ko gzip | Code splitting par route (`React.lazy`), réduction des icônes Lucide importées | Moyen |
| Frontend | LCP / FCP | Préchargement police si ajout ultérieur ; pas de images lourdes sur login | Faible |
| Backend | Latence upload sur gros fichiers | Stockage objet (S3) + upload direct signé ; worker pour antivirus | Élevé (hors MVP) |
| Backend | Montée en charge | File d’attente pour traitements lourds, plusieurs workers PHP-FPM, cache Redis pour sessions | Moyen |
| Réseau | Latence clients éloignés | CDN pour assets statiques du front ; API derrière même région | Variable |

Ces actions dépassent souvent le périmètre du prototype ; elles montrent une **vision produit** pour les investisseurs ou le jury.

---

## Voir aussi

- [MAINTENANCE.md](MAINTENANCE.md) — logs, supervision, sauvegardes.
- [TESTING.md](TESTING.md) — validation fonctionnelle avant mesures.
