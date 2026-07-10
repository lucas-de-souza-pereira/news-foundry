# Catalogue de Référence des Erreurs d'API

Ce document recense les codes d'erreur et les messages retournés par l'API backend.

---

## 1. Format Standard des Réponses d'Erreur

L'API utilise deux formats de réponse d'erreur basés sur les standards de FastAPI et de Pydantic.

### A. Format 1 : Erreur Métier (Exceptions standard)

Ce format est renvoyé lors d'erreurs logiques ou d'accès (identifiants incorrects, ressource non trouvée, accès refusé). Il contient toujours un dictionnaire avec la clé `"detail"` :

```json
{
  "detail": "Email ou mot de passe incorrect."
}
```

### B. Format 2 : Erreur de Validation de Données (FastAPI / Pydantic)

Ce format est renvoyé automatiquement avec un code **`422 Unprocessable Content`** lorsque le format de la requête entrante ne respecte pas le schéma Pydantic attendu. Il liste de manière détaillée l'emplacement (`loc`) et la nature (`msg`, `type`) de chaque erreur :

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "first_message"],
      "msg": "Field required",
      "input": null
    }
  ]
}
```

---

## 2. Catalogue Général des Erreurs

### A. Module d'Authentification (`/api/auth`)

| Code HTTP               | Message de détail (`detail`)         | Déclencheur Backend                                                                          | Action Attendue du Frontend                                                                                  |
| :---------------------- | :----------------------------------- | :------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **`401 Unauthorized`**  | `"Email ou mot de passe incorrect."` | L'adresse email n'existe pas ou le mot de passe ne correspond pas au hash Bcrypt stocké.     | Afficher une alerte sous le formulaire : _« Adresse email ou mot de passe incorrect. »_                      |
| **`422 Unprocessable`** | _(Détails de validation Pydantic)_   | Le format envoyé n'est pas du JSON ou des champs requis sont manquants (ex: `email` absent). | Valider la présence et le format des données (validation d'expression régulière pour l'email) avant l'envoi. |

### B. Module des Discussions (`/api/chats`)

| Code HTTP              | Message de détail (`detail`)            | Déclencheur Backend                                                                                     | Action Attendue du Frontend                                                                  |
| :--------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------- |
| **`401 Unauthorized`** | `"Not authenticated"`                   | Le token JWT est manquant dans l'en-tête HTTP de la requête.                                            | Rediriger immédiatement l'utilisateur vers la page de connexion (`/login`).                  |
| **`401 Unauthorized`** | `"Could not validate credentials"`      | Le token JWT est expiré ou sa signature de sécurité est invalide (clé secrète incorrecte).              | Supprimer le token expiré du stockage local et rediriger vers la page `/login`.              |
| **`403 Forbidden`**    | `"You do not have access to this chat"` | **Sécurité BOLA** : L'utilisateur connecté tente d'accéder à l'ID de discussion d'un autre utilisateur. | Bloquer l'affichage, afficher une alerte de sécurité et rediriger vers la page d'accueil.    |
| **`404 Not Found`**    | `"Chat not found"`                      | L'ID de la discussion passée dans l'URL n'existe pas en base de données.                                | Afficher une page d'erreur 404 (ex: _« Cette discussion n'existe pas ou a été supprimée »_). |

### C. Services Externes (Actualités & Intelligence Artificielle)

| Code HTTP                | Message de détail (`detail`)                | Déclencheur Backend                                                                                  | Action Attendue du Frontend                                                                                                         |
| :----------------------- | :------------------------------------------ | :--------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **`500 Internal Error`** | `"Error calling AI model: ..."`             | La communication réseau avec l'API Mistral AI a échoué ou le modèle a renvoyé une erreur.            | Afficher un message d'avertissement dans le fil de discussion : _« L'assistant IA rencontre des difficultés. Veuillez réessayer. »_ |
| **`500 Internal Error`** | `"Error generating daily system prompt..."` | L'initialisation du prompt quotidien a échoué, souvent dû à un dépassement du quota de WorldNewsAPI. | Afficher une bannière d'alerte globale : _« Impossible de charger les actualités du jour. Mode hors-ligne temporaire. »_            |
| **`500 Internal Error`** | `"Error generating press review: ..."`      | La génération structurée de la revue de presse par l'agent Mistral a planté ou a expiré.             | Afficher une modale d'erreur : _« Impossible de générer la revue de presse. Veuillez relancer la demande. »_                        |
