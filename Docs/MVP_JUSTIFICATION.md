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

## Ce qui est volontairement hors MVP

- OAuth Google/GitHub, 2FA, antivirus sur upload.
- CDN dédié, multipart résiliable, chiffrement applicatif des fichiers au repos (hors HTTPS transport).
- Application mobile native.

Ces points peuvent figurer sur une **feuille de route** post-levée de fonds.

## Indicateurs de réussite du prototype

- Parcours démo **bout en bout** en moins de cinq minutes (création de compte, upload, copie du lien, téléchargement incognito).
- **Documentation** livrée : contrat d’API, modèle de données, sécurité, tests, perf, maintenance.
- **Couverture de tests** sur les modules critiques du backend (objectif projet : seuil élevé sur `app/`, voir `Docs/TESTING.md`).

## Synthèse

Le stack **React + Laravel** maximise la vélocité tout en gardant des standards du marché ; Sanctum et les policies Laravel adressent le cœur du risque (**accès aux fichiers**). Le MVP est dimensionné pour la **démonstration investisseurs**, pas pour la charge maximale — les contraintes de perf et de sécurité sont **documentées et mesurables** pour montrer une démarche professionnelle de montée en gamme.
