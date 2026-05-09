# Support de soutenance — Datashare (prototype)

Document **synthétique** pour structurer une présentation orale (slides PowerPoint, Google Slides ou équivalent). Adapter le nombre de minutes selon le créneau.

---

## Slide 1 — Titre

- **Datashare** — Plateforme de transfert sécurisé de fichiers  
- Prototype MVP — public : freelances et petites structures  
- Auteur / équipe — date de soutenance  

---

## Slide 2 — Contexte et besoin

- Partage de fichiers avec **lien à expiration** sans passer par des services grand public non maîtrisés  
- Besoin produit : **compte**, **dépôt**, **liste**, **suppression**, **téléchargement** par URL publique contrôlée  
- Contrainte : **délivrabilité en quelques semaines** et démonstration convaincante  

---

## Slide 3 — Architecture (vue d’ensemble)

- **SPA** React (Vite) + **API** Laravel (Sanctum) + **SGBDR** + **stockage disque**  
- Schéma : navigateur → HTTPS → routes `/api` → contrôleurs → policies → stockage / base  
- Référence : diagramme dans [`Docs/README.md`](README.md)  

---

## Slide 4 — Choix techniques (pourquoi ce stack ?)

- **React + Vite** : vélocité, écosystème, UX réactive  
- **Laravel + Sanctum** : auth API, validation, filesystem, migrations, tests intégrés  
- **JWT-like** via tokens Sanctum pour la SPA  
- Détail : [`MVP_JUSTIFICATION.md`](MVP_JUSTIFICATION.md)  

---

## Slide 5 — Modèle de données (résumé)

- Entités **User** et **File** (1,N)  
- Jeton **UUID** unique pour le téléchargement public, **expiration** métier  
- Sanctum : table `personal_access_tokens`  

---

## Slide 6 — Sécurité (points clés)

- Routes protégées `auth:sanctum` ; téléchargement public **uniquement** par `token`  
- **FilePolicy** : accès aux métadonnées / suppression réservé au propriétaire  
- Limite upload **10 Mo**, validation des entrées  
- Référence : [`SECURITY.md`](SECURITY.md)  

---

## Slide 7 — Qualité et tests

- Tests **Feature** PHPUnit sur auth, fichiers, policies, téléchargement  
- Objectif de **couverture** sur le backend (voir `composer run test:coverage`)  
- Plan documenté : [`TESTING.md`](TESTING.md)  

---

## Slide 8 — Performance

- **Backend** : scénario **k6** (login → upload → download) — [`PERF.md`](PERF.md)  
- **Frontend** : budget bundle (build production), pistes **Lighthouse**  
- Métriques à journaliser : temps de réponse API, taille des transferts  

---

## Slide 9 — Difficultés rencontrées et solutions (à personnaliser)

| Difficulté | Solution retenue |
| --- | --- |
| Alignement URL API (SPA / `APP_URL`) | Configuration `api.js` + `.env` documentée |
| Droits sur les fichiers | Policies Laravel + tests 403 |
| *(ajouter vos retours réels)* | *( … )* |

---

## Slide 10 — Maintenance et évolution

- Mises à jour **Composer** / **npm** : fréquence et risques — [`MAINTENANCE.md`](MAINTENANCE.md)  
- Sauvegardes : base + répertoire `storage/app`  
- Pistes : rate limiting, antivirus upload, OAuth (hors MVP)  

---

## Slide 11 — Utilisation de l’IA (si demandé en jury)

- Mode **assistant** (~60 % du volume documentaire / itérations) ; supervision humaine sur sécurité et cohérence spec/code  
- Référence : [`AI_USAGE.md`](AI_USAGE.md)  

---

## Slide 12 — Démo live (check-list)

1. Inscription ou connexion  
2. Upload d’un fichier  
3. Copie du **lien** → navigation privée → téléchargement  
4. *(Option)* expiration / suppression  

---

## Slide 13 — Conclusion

- MVP **fonctionnel** et **documenté** (API, données, qualité, perf, maintenance)  
- Dépôt public : voir `REPOSITORY_URL.txt` à la racine  
- Questions  

---

*Ce fichier est volontairement textuel pour être copié-collé vers votre outil de présentation ; ajoutez captures d’écran (dashboard, Postman, rapport k6, Lighthouse) pour le rendu visuel.*
