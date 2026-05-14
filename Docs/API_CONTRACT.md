# Contrat d’API — Datashare

Base URL : `{APP_URL}/api` (ex. `http://127.0.0.1:8000/api`).  
Sauf indication contraire, les réponses d’erreur Laravel suivent le format JSON habituel (`message`, `errors` pour la validation).

## Authentification

Les routes marquées **Bearer** attendent un en-tête :

```http
Authorization: Bearer {token_sanctum}
```

Le jeton est obtenu via `POST /login`.

---

## Santé

### `GET /test`


| Auth        | Non                       |
| ----------- | ------------------------- |
| Réponse 200 | `{ "message": "API OK" }` |


---

## Auth — inscription

### `POST /register`


| Auth         | Non                |
| ------------ | ------------------ |
| Content-Type | `application/json` |


**Corps**


| Champ      | Type   | Contraintes                   |
| ---------- | ------ | ----------------------------- |
| `name`     | string | requis, max 255               |
| `email`    | string | requis, email, unique `users` |
| `password` | string | requis, min 6 caractères      |


**Réponses**


| Code | Corps                                        |
| ---- | -------------------------------------------- |
| 201  | `{ "message": "User created successfully" }` |
| 422  | Erreurs de validation Laravel                |


---

## Auth — connexion

### `POST /login`


| Auth         | Non                |
| ------------ | ------------------ |
| Content-Type | `application/json` |


**Corps**


| Champ      | Type          |
| ---------- | ------------- |
| `email`    | string, email |
| `password` | string        |


**Réponses**


| Code | Corps                                |
| ---- | ------------------------------------ |
| 200  | `{ "token": "<plainTextToken>" }`    |
| 401  | `{ "error": "Invalid credentials" }` |
| 422  | Validation                           |


---

## Auth — déconnexion

### `POST /logout`


| Auth | Bearer |
| ---- | ------ |


Révoque uniquement le jeton utilisé pour la requête.

**Réponses**


| Code | Corps                                      |
| ---- | ------------------------------------------ |
| 200  | `{ "message": "Logged out successfully" }` |
| 401  | Non authentifié                            |


---

## Utilisateur courant

### `GET /user`


| Auth | Bearer |
| ---- | ------ |


**Réponses**


| Code | Corps                                                              |
| ---- | ------------------------------------------------------------------ |
| 200  | Objet utilisateur JSON (sans mot de passe ; sérialisation Laravel) |
| 401  | Non authentifié                                                    |


---

## Fichiers — upload

### `POST /files`


|              |                       |
| ------------ | --------------------- |
| Auth         | Bearer                |
| Content-Type | `multipart/form-data` |


**Corps**


| Champ  | Type    | Contraintes                                        |
| ------ | ------- | -------------------------------------------------- |
| `file` | fichier | requis, max **10 Mo** (`10240` ko côté validation) |


**Réponses**


| Code | Corps                                                |
| ---- | ---------------------------------------------------- |
| 201  | Voir *Réponse upload* ci-dessous                     |
| 401  | Non authentifié                                      |
| 422  | Validation (fichier manquant, trop volumineux, etc.) |


**Réponse upload (201)**

```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": 1,
    "user_id": 1,
    "original_name": "document.pdf",
    "stored_name": "…",
    "path": "uploads/…",
    "mime_type": "application/pdf",
    "size": 12345,
    "token": "uuid-v4",
    "expires_at": "2026-05-16T12:00:00.000000Z",
    "created_at": "…",
    "updated_at": "…"
  },
  "download_url": "http://127.0.0.1:8000/api/files/download/{token}"
}
```

À la création, `expires_at` est fixé à **J+7**. Le **partage** repose sur ce lien : il n’existe pas de route séparée « share » ; l’URL complète est renvoyée dans `download_url`.

---

## Fichiers — liste

### `GET /files`


| Auth | Bearer |
| ---- | ------ |


**Query (optionnel)**


| Paramètre | Description                                                                          |
| --------- | ------------------------------------------------------------------------------------ |
| `search`  | Filtre sur `original_name` (`LIKE %…%`)                                              |
| `sort`    | Une de : `created_at`, `original_name`, `size` (défaut `created_at`, ordre **desc**) |


**Réponses**


| Code | Corps                                                                                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------- |
| 200  | Pagination Laravel (`data`, `current_page`, `per_page`, `total`, …) — chaque élément de `data` est un enregistrement `files` |
| 401  | Non authentifié                                                                                                              |


---

## Fichiers — détail

### `GET /files/{id}`


| Auth | Bearer                           |
| ---- | -------------------------------- |
| `id` | identifiant numérique du fichier |


**Réponses**


| Code | Corps                                       |
| ---- | ------------------------------------------- |
| 200  | `{ "file": { … } }`                         |
| 403  | Utilisateur non propriétaire (`FilePolicy`) |
| 404  | Fichier inexistant                          |
| 401  | Non authentifié                             |


---

## Fichiers — mise à jour

### `PUT /files/{id}`


| Auth         | Bearer             |
| ------------ | ------------------ |
| Content-Type | `application/json` |


**Corps (tous optionnels)**


| Champ           | Type                          |
| --------------- | ----------------------------- |
| `original_name` | string, max 255               |
| `expires_at`    | date ISO ou `null` (nullable) |


**Réponses**


| Code | Corps                                                       |
| ---- | ----------------------------------------------------------- |
| 200  | `{ "message": "File updated successfully", "file": { … } }` |
| 403  | Non propriétaire                                            |
| 404  | Inexistant                                                  |
| 422  | Validation                                                  |


---

## Fichiers — suppression

### `DELETE /files/{id}`


| Auth | Bearer |
| ---- | ------ |


Supprime l’enregistrement et le fichier sur disque si présent.

**Réponses**


| Code | Corps                                        |
| ---- | -------------------------------------------- |
| 200  | `{ "message": "File deleted successfully" }` |
| 403  | Non propriétaire                             |
| 404  | Inexistant                                   |
| 401  | Non authentifié                              |


---

## Téléchargement public (lien partagé)

### `GET /files/download/{token}`


| Auth    | Non                                         |
| ------- | ------------------------------------------- |
| `token` | UUID stocké en base (colonne `files.token`) |


**Réponses**


| Code | Comportement                                                                                                                        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 200  | Stream téléchargement (`Content-Disposition: attachment`, nom = `original_name`)                                                    |
| 403  | JSON `{ "message": "Download link expired" }` si `expires_at` dépassé                                                               |
| 404  | JSON `{ "message": "File not found" }` si le fichier disque est absent ; ou **404** Laravel si le token est inconnu (`firstOrFail`) |


---

## Codes d’erreur fréquents


| HTTP | Contexte                                                         |
| ---- | ---------------------------------------------------------------- |
| 401  | Route protégée sans token ou token invalide                      |
| 403  | Policy fichier (accès réservé au propriétaire) ou lien expiré    |
| 404  | Ressource introuvable (id ou token) ou fichier physique manquant |
| 422  | Validation des entrées                                           |


