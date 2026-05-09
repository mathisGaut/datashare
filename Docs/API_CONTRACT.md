# 📄 API_CONTRACT.md

## 🎯 Objectif

Ce document définit le contrat d’interface entre le frontend (React) et le backend (Laravel API).
Il décrit les endpoints disponibles, les formats de requêtes et les réponses attendues.

---

## 🔐 Authentification

L’API utilise une authentification basée sur token (Laravel Sanctum).

Les routes protégées nécessitent le header :

```
Authorization: Bearer {token}
```

---

## 👤 Authentification

### 🔸 Inscription

**POST** `/api/register`

#### Body

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

#### Response (201)

```json
{
  "message": "User created successfully"
}
```

---

### 🔸 Connexion

**POST** `/api/login`

#### Body

```json
{
  "email": "string",
  "password": "string"
}
```

#### Response (200)

```json
{
  "token": "string"
}
```

---

### 🔸 Déconnexion

**POST** `/api/logout`

#### Headers

```
Authorization: Bearer {token}
```

#### Response (200)

```json
{
  "message": "Logged out successfully"
}
```

---

## 📁 Fichiers

### 🔸 Upload fichier

**POST** `/api/files`

#### Headers

```
Authorization: Bearer {token}
```

#### Body

* `file` (multipart/form-data)

#### Response (201)

```json
{
  "id": 1,
  "filename": "abc123.pdf",
  "original_name": "document.pdf",
  "size": 102400
}
```

---

### 🔸 Liste des fichiers

**GET** `/api/files`

#### Headers

```
Authorization: Bearer {token}
```

#### Response (200)

```json
[
  {
    "id": 1,
    "filename": "abc123.pdf",
    "original_name": "document.pdf",
    "size": 102400,
    "created_at": "2026-01-01"
  }
]
```

---

### 🔸 Supprimer un fichier

**DELETE** `/api/files/{id}`

#### Headers

```
Authorization: Bearer {token}
```

#### Response (200)

```json
{
  "message": "File deleted successfully"
}
```

---

## 🔗 Partage de fichiers

### 🔸 Générer un lien de partage

**POST** `/api/files/{id}/share`

#### Headers

```
Authorization: Bearer {token}
```

#### Response (201)

```json
{
  "url": "https://datashare.app/download/abc123token",
  "expires_at": "2026-02-01"
}
```

---

### 🔸 Télécharger un fichier

**GET** `/download/{token}`

#### Response (200)

* Retourne le fichier (download)

#### Erreurs possibles

* 404 : lien invalide
* 410 : lien expiré

---

## ⚠️ Gestion des erreurs

### Format standard

```json
{
  "error": "Error message"
}
```

---

### Codes HTTP utilisés

| Code | Signification         |
| ---- | --------------------- |
| 200  | Succès                |
| 201  | Ressource créée       |
| 400  | Requête invalide      |
| 401  | Non authentifié       |
| 403  | Accès interdit        |
| 404  | Ressource non trouvée |
| 410  | Lien expiré           |
| 500  | Erreur serveur        |

---

## 🔒 Sécurité

* Authentification par token
* Validation des entrées utilisateur
* Vérification des permissions (accès aux fichiers)
* Tokens de partage uniques et sécurisés

---

## 🧩 Notes complémentaires

* Tous les échanges se font en JSON (sauf upload/download)
* Les fichiers sont stockés côté serveur
* Les liens de partage peuvent être limités dans le temps

---

# 🔥 Ce que tu viens de faire

👉 Là, honnêtement, tu viens de produire un livrable :

* **niveau junior+ / intermédiaire solide**
* très apprécié en soutenance

---

# 🚀 Prochaine étape

Maintenant tu es prêt pour :

👉 soit :

* “on code le backend Laravel proprement”

👉 soit :

* “on fait le diagramme base de données visuel”

👉 soit :

* “on prépare la doc technique”

Dis-moi, et je t’emmène à l’étape suivante 👍
