# Utilisation de l’IA dans le développement — Datashare

Ce document répond à l’exigence de traçabilité : quelles tâches ont été confiées à un assistant IA, quel rôle de supervision humaine, et quels ajustements ont été nécessaires.

## Estimation de l’effort IA (~60 %)

Une estimation honnête du travail **assisté** par l’IA (génération de code, restructuration, documentation à partir de briefs) est d’environ **60 %** du volume livré sur la durée du prototype, le reste correspondant à la conception, aux arbitrages, aux revues, aux corrections et au pilotage (priorités MVP, sécurité, cohérence avec les consignes).

Cette proportion reflète un usage majoritaire de l’IA comme **assistant** : le référent humain fournit le contexte (stack, chemins de fichiers, comportements attendus, contraintes OpenClassrooms / investisseurs), valide ou rejette les propositions, et consolide le résultat dans le dépôt.

## Périmètre confié à l’assistant IA

- **Documentation technique** : rédaction structurée à partir des informations transmises par le référent (architecture existante, endpoints réels, migrations). Les fichiers `API_CONTRACT.md`, `DATA_MODEL.md`, sections du README, et documents de qualité (`TESTING`, `SECURITY`, etc.) ont été **produits ou complétés** avec ce mode opératoire : consigne précise + relevé du code source pour éviter les écarts spec / implémentation.
- **Refactorings et ergonomie** : extraits de composants React (hooks, tableau de bord, upload), reformulations pour lisibilité, suggestions de tests PHPUnit alignés sur les contrôleurs.
- **Automatisation textuelle** : formulations de plans de test, check-lists maintenance, commentaires de rapport (performance k6, audits npm).

## Rôle de supervision humaine

- **Choix d’architecture et stack** : React + Vite, Laravel 13, Sanctum, stockage local — décidés et maintenus par le référent ; l’IA ne substitue pas une revue des risques (auth, policies, expiration des liens).
- **Revue de sécurité** : validation des règles `FilePolicy`, contrôle des routes publiques vs protégées, validation des entrées (`max` upload, email unique).
- **Validation fonctionnelle** : parcours inscription → upload → copie du lien → téléchargement anonyme ; gestion des erreurs UI.
- **Git et qualité** : lecture des diffs, décision des commits, correction des écarts par rapport au brief (liens documentation cassés, seuils de tests, etc.).

## Correctifs et ajustements après génération

- Alignement **documentation / code** lorsque le contrat mentionnait des routes ou champs non implémentés : la doc finale reflète les routes réelles (`routes/api.php`).
- Renforcement des **tests** lorsque la couverture ou les cas critiques (403, 404, fichiers manquants sur disque) manquaient par rapport au besoin MVP.
- Reformulations pour respecter les **contraintes du rendu** (longueur, ton professionnel, références aux fichiers du dépôt).

## Bonnes pratiques retenues

- Ne jamais fusionner une contribution IA sans **lecture du diff** sur les zones sensibles (auth, téléchargement public, suppression fichier).
- Fournir à l’IA le **contexte fichier** (extraits de contrôleurs, migrations) pour limiter les hallucinations sur les chemins d’API.
- Isoler dans des commits ou messages explicites les lots « doc », « tests », « feat » pour garder un historique lisible pour la soutenance.
