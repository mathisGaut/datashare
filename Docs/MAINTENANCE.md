# Maintenance — Datashare

Guide court pour naviguer dans le dépôt, faire évoluer les dépendances et assurer la continuité du service.

## Structure du projet

```text
Datashare/
├── README.md                   # Point d’entrée clone / démarrage rapide
├── datashare-backend/          # API Laravel (Sanctum, fichiers, migrations)
│   ├── app/
│   │   ├── Http/Controllers/ # AuthController, FileController
│   │   ├── Models/
│   │   └── Policies/
│   ├── database/               # migrations, seeders, factories
│   ├── routes/api.php
│   └── config/
├── datashare-frontend/         # SPA React + Vite + Tailwind
│   └── src/
│       ├── pages/
│       ├── hooks/
│       └── services/api.js     # base URL Axios
├── Docs/                       # README technique, API_CONTRACT, DATA_MODEL, qualité
└── perf/                       # Scripts k6 (voir PERF.md)
```

## Maintenance courante

| Tâche | Action |
| --- | --- |
| Mise à jour schéma BDD | Nouvelle migration `php artisan make:migration`, puis `php artisan migrate` |
| Données de démo | Ajuster `DatabaseSeeder`, puis `php artisan db:seed` |
| Rotation secrets | Régénérer `APP_KEY` uniquement si nécessaire ; mettre à jour mots de passe DB et clés services dans `.env` |
| Nettoyage fichiers orphelins | Script artisan ou tâche planifiée (à ajouter si besoin) pour aligner disque et base |

## Mise à jour des dépendances

### PHP (Composer)

```bash
cd datashare-backend
composer outdated
composer update              # après lecture du changelog Laravel / packages
php artisan migrate          # si nouvelles migrations fournies par les packages
```

Après mise à jour : lancer `composer audit`, la suite de tests `composer test`, et un smoke test manuel (login + upload).

### JavaScript (npm)

**Frontend**

```bash
cd datashare-frontend
npm outdated
npm update
npm audit
npm run build
```

**Backend (Vite / Tailwind côté Laravel)**

```bash
cd datashare-backend
npm outdated
npm update
npm audit
```

Automatiser les audits en CI (voir [SECURITY.md](SECURITY.md)).

### Fréquence recommandée et risques

| Type | Fréquence indicative | Risques principaux | Mitigation |
| --- | --- | --- | --- |
| Correctifs **sécurité** (`npm audit`, `composer audit`, advisories GitHub) | Dès notification ou au moins **mensuel** | Régression fonctionnelle après montée de version majeure | Lire changelog ; tests auto + smoke manuel ; branche dédiée |
| **Laravel / PHP** (`composer update`) | **Trimestriel** ou après release LTS si stabilité recherchée | Breaking changes framework, dépendances transitives | `composer outdated` ; notes de version Laravel ; sauvegarde BDD avant migration |
| **React / Vite / Tailwind** (`npm update` frontend) | **Mensuel** en prototype ; plus conservateur en prod | Build cassé, changements ESLint | `npm run build` en CI ; fix lint avant merge |
| **SGBD** (patch serveur MySQL/PostgreSQL) | Selon hébergeur / **criticité** | Indisponibilité pendant upgrade | Fenêtre maintenance ; dump avant upgrade |

Scripts d’aide à l’installation BDD : [`scripts/README.md`](../scripts/README.md) et [`setup-database.sh`](../scripts/setup-database.sh).

### Cohérence documentation / code

Après chaque évolution significative (nouvelle route, limite upload, durée d’expiration des liens), mettre à jour **en même temps** : `Docs/API_CONTRACT.md`, `Docs/SECURITY.md` si exposition surface d’attaque, et ce fichier si procédures changent.

## Monitoring

- **Disponibilité** : sonder `GET /api/test` ou `GET /up` depuis l’extérieur.
- **Erreurs** : agréger `storage/logs/laravel.log` ; en production utiliser un collecteur (Sentry, CloudWatch, etc.).
- **Filesystème** : alertes sur espace disque du volume contenant `storage/app`.

## Logs

| Source | Emplacement / commande |
| --- | --- |
| Laravel | `datashare-backend/storage/logs/laravel.log` |
| Temps réel (dev) | `php artisan pail` (si package présent) |
| Serveur web | Fichiers access/error du vhost (nginx, Apache, Caddy) |

Rotation : configurer `logrotate` ou équivalent sur la machine hôte ; pour les clouds managés, utiliser les options du fournisseur.

## Sauvegarde de la base de données

### SQLite (fichier)

Fichier typique : `datashare-backend/database/database.sqlite`.

```bash
# Exemple : copie datée
cp database/database.sqlite "../backups/datashare-$(date +%Y%m%d).sqlite"
```

Copier aussi le dossier `storage/app` si les fichiers utilisateur doivent être restaurés avec la même base.

### MySQL / PostgreSQL

Utiliser les outils natifs (`mysqldump`, `pg_dump`) depuis cron ou le backup managé du fournisseur cloud.

### Restauration

1. Arrêter les écritures ou passer en maintenance.
2. Restaurer le dump / fichier SQLite.
3. Restaurer `storage/app` en cohérence avec les chemins en base.
4. `php artisan config:cache` puis vérification fonctionnelle.

## Check-list après incident ou déploiement

- [ ] Migrations appliquées
- [ ] `APP_ENV`, `APP_DEBUG`, `APP_URL` corrects
- [ ] Stockage accessible en écriture (`storage`, `bootstrap/cache`)
- [ ] Testlogin + upload + download par lien
