# Tests — Datashare

Ce document décrit la stratégie de test, l’inventaire des cas et les commandes pour les tests unitaires, les tests d’API et la couverture de code.

## Plan de test

| Id | Zone | Objectif | Type |
| --- | --- | --- | --- |
| T1 | Auth | Inscription valide → 201 | API / Feature |
| T2 | Auth | Login correct → token présent | API / Feature |
| T3 | Auth | Login incorrect → 401 | API / Feature |
| T4 | Auth | Logout révoque le token | API / Feature |
| T5 | Auth | `GET /api/user` avec token → profil | API / Feature |
| T6 | Fichiers | Upload authentifié → 201 + métadonnées | API / Feature |
| T7 | Fichiers | Sans auth → upload/list interdits | API / Feature |
| T8 | Fichiers | Liste `/api/files` → pagination | API / Feature |
| T9 | Fichiers | Accès `show` autre utilisateur → 403 | API / Feature |
| T10 | Fichiers | Download par token valide → 200 | API / Feature |
| T11 | Fichiers | Download token expiré → 403 | API / Feature |
| T12 | Fichiers | Download token inconnu → 404 | API / Feature |
| T13 | Fichiers | Download fichier absent du disque → 404 JSON | API / Feature |
| T14 | Fichiers | Update / delete propriétaire OK ; autre user → 403 | API / Feature |
| T15 | Fichiers | Liste `search` et tri invalide ignoré | API / Feature |
| T16 | Frontend | Navigation login → dashboard | Manuel / E2E (optionnel) |
| T17 | Régression | `GET /` Laravel welcome → 200 | Feature (existant) |

Les tests automatisés **T1–T15** et **T17** sont dans `datashare-backend/tests/Feature` avec `RefreshDatabase` et factories (`UserFactory`, `FileFactory`).

## Tableau des tests (suivi)

| Id | Automatisé | Statut | Fichier / note |
| --- | --- | --- | --- |
| T1 | Oui | OK | `tests/Feature/AuthRegisterTest.php` |
| T2–T3 | Oui | OK | `tests/Feature/AuthLoginTest.php` |
| T4–T5 | Oui | OK | `tests/Feature/AuthLogoutTest.php` |
| T6 | Oui | OK | `tests/Feature/FileUploadTest.php` |
| T7 | Oui | OK | `tests/Feature/FileManagementTest.php` |
| T8 | Oui | OK | `tests/Feature/FileListTest.php` |
| T9 | Oui | OK | `tests/Feature/FilePolicyTest.php` |
| T10–T11 | Oui | OK | `tests/Feature/FileDownloadTest.php` |
| T12–T15 | Oui | OK | `tests/Feature/FileManagementTest.php` |
| T16 | Non | Manuel ou Playwright/Cypress | — |
| T17 | Oui | OK | `tests/Feature/ExampleTest.php` |

## Tests unitaires (backend)

- Localisation : `datashare-backend/tests/Unit/`.
- Framework : **PHPUnit 12** (via `php artisan test` ou `vendor/bin/phpunit`).
- Exemple : `tests/Unit/ExampleTest.php`.
- **Policies** : `tests/Unit/FilePolicyTest.php` (règles propriétaire / non propriétaire sans passer par HTTP).

Commandes :

```bash
cd datashare-backend
php artisan test
# ou
./vendor/bin/phpunit
```

Pour filtrer :

```bash
php artisan test --filter=NomDuTest
```

## Tests API (Feature)

- Localisation : `datashare-backend/tests/Feature/`.
- Utiliser `Illuminate\Foundation\Testing\RefreshDatabase` pour isoler la base de test (`phpunit.xml` utilise SQLite en mémoire : `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`).
- Authentification Sanctum dans les tests : `Sanctum::actingAs($user)` ou token réel via `POST /api/login` pour tester la révocation au logout.

## Tests frontend

- **Lint** : `npm run lint` dans `datashare-frontend`.
- Tests unitaires composants : non configurés par défaut ; ajout possible avec **Vitest** + **Testing Library** si besoin.

## Couverture de code (PHPUnit)

Prérequis : extension PHP **PCOV** (recommandé) ou **Xdebug** avec couverture activée.

Génération HTML :

```bash
cd datashare-backend
php artisan test --coverage-html coverage-report
```

Objectif projet pour le dossier `app/` : **au moins 70 % de lignes** sur les chemins critiques (contrôleurs, policies, modèles métier). Vérification avec seuil :

```bash
cd datashare-backend
composer run test:coverage
# équivalent : php artisan test --coverage --min=70
```

Si la commande échoue faute d’extension de couverture, installer PCOV ou activer Xdebug puis relancer. Conserver une capture d’écran du rapport HTML pour la soutenance (dossier `coverage-report/index.html` non versionné par défaut ; régénérer avant présentation).

## Références

- Configuration PHPUnit : `datashare-backend/phpunit.xml`
- Contrat API : `Docs/API_CONTRACT.md`
