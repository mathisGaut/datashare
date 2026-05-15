# Justification du MVP — Datashare

Document court (soutenance investisseurs / validation pédagogique) : périmètre, choix techniques et compromis assumés pour une livraison en **quatre semaines**.

## Objectif produit

Offrir aux freelances et petites structures un **dépôt web sécurisé** avec **compte utilisateur**, **envoi de fichiers**, **gestion des dépôts** et **partage par lien** à expiration — sans viser une plateforme enterprise complète.

## Choix techniques

### Frontend : React, Vite, Tailwind

- **React** : écosystème mature, composants réutilisables, recrutement et maintenance facilités.
- **Vite** : temps de build et HMR rapides pour itérer pendant le sprint.
- **Tailwind** : UI cohérente avec peu de CSS ad hoc, adaptée à un prototype présentable.

### Backend : Laravel, Sanctum

- **Laravel** : auth, validation, filesystem, migrations et tests intégrés ; gain de temps sur le MVP.
- **Sanctum** : tokens API simples pour une SPA (Bearer), sans sur-complexifier OAuth2 pour un prototype.

### Base de données et stockage

- **SGBDR relationnel** (SQLite en dev, MySQL/PostgreSQL en prod) : modèle **User / File** clair, intégrité référentielle (FK + cascade).
- **Fichiers sur disque** : pas de blob en base pour limiter la charge DB et simplifier les sauvegardes (dump SQL + dossier `storage`).

### Tests et qualité

- **PHPUnit Feature** sur l’API : meilleur rapport effort / confiance pour les parcours critiques (auth, upload, policy, téléchargement par jeton).
- **k6** sur upload + download : démonstration mesurable pour la perf, conforme au brief.

## Justification de l’architecture

L’architecture retenue repose sur une séparation claire entre :

- un frontend SPA React,
- une API REST Laravel,
- une base de données relationnelle,
- et un stockage disque pour les fichiers.

### Avantages de cette architecture

- Découplage frontend/backend facilitant la maintenance.
- API réutilisable par un futur client mobile.
- Sécurisation centralisée côté backend.
- Scalabilité progressive possible (hébergement séparé frontend/API).
- Déploiement simplifié en environnement Docker via Laravel Sail.

### Dette technique assumée du MVP

Afin de respecter les contraintes de temps du prototype, certains choix privilégient la rapidité de livraison :

- stockage local des fichiers plutôt que S3/CDN,
- absence de queue système pour les uploads lourds,
- absence d’antivirus ou de scan de contenu,
- monitoring limité à des logs applicatifs et métriques simples.

Ces limitations sont documentées et pourront évoluer dans une version post-MVP.

## Bonnes pratiques d’implémentation

Le projet suit plusieurs bonnes pratiques de développement afin de conserver un code maintenable et évolutif malgré le périmètre MVP.

### Séparation des responsabilités

- Frontend séparé du backend (SPA React + API Laravel REST).
- Contrôleurs Laravel limités à la gestion HTTP.
- Logique métier répartie entre modèles, policies et mécanismes natifs Laravel.
- Hooks React (`useAuth`, `useFiles`) pour isoler la logique de données des composants UI.

### Principes de conception

Le projet applique partiellement les principes **SOLID** adaptés à un MVP :

- **Single Responsibility Principle** : composants React spécialisés (`UploadBox`, `FileCard`, `SearchBar`, etc.).
- **Open/Closed Principle** : architecture modulaire facilitant l’ajout de nouveaux endpoints ou composants tout en limitant l’impact sur l’existant.
- **Dependency Inversion** : consommation centralisée de l’API via `services/api.js`.

### Maintenabilité

- Structure de projet claire (`components`, `hooks`, `services`, `controllers`, `policies`, `tests`).
- Validation centralisée Laravel.
- Policies pour éviter la duplication des contrôles d’accès.
- Documentation synchronisée avec le code (`API_CONTRACT.md`, `SECURITY.md`, `TESTING.md`).

## Aspects réglementaires et qualité

### RGPD

Le prototype limite volontairement les données personnelles métier stockées :

- nom,
- email,
- fichiers déposés.

L’infrastructure Laravel stocke également certaines données techniques nécessaires au fonctionnement de l’application (sessions, jetons d’API Sanctum).

Les mots de passe sont hachés via les mécanismes sécurisés fournis par Laravel (`Hash::make`).
Les fichiers ne sont accessibles qu’au propriétaire ou via un lien temporaire sécurisé.

Dans une version production, des fonctionnalités complémentaires seraient nécessaires :

- politique de conservation des données,
- suppression automatique des comptes inactifs,
- export des données utilisateur,
- bannière et politique de confidentialité.

### Accessibilité (A11Y)

L’interface utilise des composants HTML standards compatibles clavier :

- boutons natifs,
- formulaires accessibles,
- contrastes visuels cohérents via Tailwind.

Le projet peut être audité avec Lighthouse ou axe DevTools pour améliorer :
- navigation clavier,
- labels ARIA,
- score WCAG.

### Monitoring et observabilité

Le MVP s’appuie principalement sur :

- les logs Laravel (`storage/logs`),
- les erreurs navigateur,
- et des tests automatisés.

En production, l’architecture pourrait intégrer :
- Sentry,
- métriques serveur,
- supervision uptime,
- alertes de saturation stockage.

## Indicateurs de réussite du prototype

- Parcours démo **bout en bout** en moins de cinq minutes (création de compte, upload, copie du lien, téléchargement incognito).
- **Documentation** livrée : contrat d’API, modèle de données, sécurité, tests, perf, maintenance.
- **Couverture de tests** sur les modules critiques du backend (objectif minimal : 70 % sur `app/`, voir `Docs/TESTING.md`).

## Synthèse

Le stack **React + Laravel** maximise la vélocité tout en gardant des standards du marché ; Sanctum et les policies Laravel adressent le cœur du risque (**accès aux fichiers**). Le MVP est dimensionné pour la **démonstration investisseurs**, pas pour la charge maximale — les contraintes de perf et de sécurité sont **documentées et mesurables** pour montrer une démarche professionnelle de montée en gamme.