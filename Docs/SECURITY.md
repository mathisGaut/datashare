# Sécurité — Datashare

Vue d’ensemble des mécanismes de sécurité du backend Laravel et des contrôles à maintenir en production.

## Authentification — Laravel Sanctum

- **Tokens API** : après connexion réussie (`POST /api/login`), un jeton personnel est créé via `HasApiTokens` sur le modèle `User` et renvoyé au client (`plainTextToken`).
- **Routes protégées** : groupe `Route::middleware('auth:sanctum')` dans `routes/api.php` pour `/user`, `/logout` et toutes les routes `/files` sauf téléchargement public.
- **Déconnexion** : `POST /api/logout` supprime le token courant (`currentAccessToken()->delete()`).
- **Configuration** : `config/sanctum.php` — domaines stateful (`SANCTUM_STATEFUL_DOMAINS`), expiration optionnelle des tokens (`expiration`, actuellement `null` = pas d’expiration serveur par défaut pour les tokens Sanctum).

Recommandation production : définir une politique d’expiration ou de rotation des tokens selon le niveau de risque ; utiliser **HTTPS** partout.

## Policies

- **`App\Policies\FilePolicy`** : autorise `view`, `update`, `delete` uniquement si `$user->id === $file->user_id`.
- Enregistrement : convention Laravel — `File` → `FilePolicy` (découverte automatique si les noms suivent la convention).
- Contrôleur : `FileController` appelle `$this->authorize(...)` sur `show`, `update`, `destroy`.

## Validation des entrées

| Endpoint | Règles principales |
| --- | --- |
| `POST /api/register` | `name`, `email` (unique), `password` (min 6) |
| `POST /api/login` | `email`, `password` requis |
| `POST /api/files` | `file` requis, fichier, max 10 Mo (`max:10240`) |
| `PUT /api/files/{id}` | `original_name` optionnel string ; `expires_at` nullable date |

Les erreurs de validation renvoient une réponse JSON standard Laravel (422).

## Protection de l’accès aux fichiers

- **Stockage** : fichiers sous `storage/app/` (chemins enregistrés en base), non servis directement par le web root sans passer par Laravel.
- **Contrôle propriétaire** : liste `index` limitée à `auth()->user()->files()` ; lecture / modification / suppression via policies.
- **Téléchargement public** : uniquement via `token` UUID inconnu des autres utilisateurs ; pas d’accès par ID numérique sans authentification.

## Expiration des liens de téléchargement

- À la création (`store`), `expires_at` est fixé à **7 jours** (`now()->addDays(7)`).
- `download` refuse si `expires_at` est dépassé (réponse JSON erreur, statut **403** dans l’implémentation actuelle).
- `update` permet de modifier `expires_at` pour prolonger ou ajuster (utilisateur authentifié propriétaire).

## Scans de sécurité — dépendances

### npm audit

À exécuter régulièrement dans **chaque** projet Node ayant un `package.json`.

```bash
cd datashare-frontend && npm audit
cd datashare-backend && npm audit
```

**Résultat capturé le 2026-05-09** (environnement de développement du dépôt) :

- `datashare-frontend` : **0 vulnérabilités**
- `datashare-backend` (assets Vite) : **0 vulnérabilités**

### composer audit

Audite les paquets PHP déclarés dans Composer contre la base de données advisories.

```bash
cd datashare-backend
composer audit
```

**Note** : si la commande échoue à cause de l’installation PHP locale (extensions, Herd, etc.), corrigez l’environnement PHP puis relancez `composer audit`. En CI (GitHub Actions, GitLab CI), exécutez cette commande sur une image où PHP et Composer sont fonctionnels pour un résultat reproductible.

Sortie attendue en l’absence de problème : aucune advisory critique bloquante ; traiter toute alerte affichée (mise à jour de version ou contournement documenté).

## Bonnes pratiques complémentaires

- Ne jamais committer `.env`, clés API ou jetons.
- Durcir `APP_DEBUG=false` en production.
- Envisager limitation de débit (rate limiting) sur `/api/login` et `/api/register`.
- Sauvegardes base + dossier `storage/app/uploads` (voir `MAINTENANCE.md`).

## Alignement avec les autres livrables

Toute modification des règles d’auth, des quotas ou des endpoints doit être reflétée dans **`Docs/API_CONTRACT.md`**, **`Docs/TESTING.md`** (cas automatisés) et, si impact utilisateur, dans **`README.md`** racine pour éviter un décalage entre dépôt et soutenance.
