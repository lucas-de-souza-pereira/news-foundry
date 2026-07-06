# Choix Techniques et Améliorations de l'IA

Ce document présente et justifie les choix technologiques retenus pour le projet. Il expose également la liste des dépendances de l'application
ainsi que les choix de conception des prompts.

---

## 1. Choix d'Architecture Majeurs

### A. FastAPI (Backend)

- **Justification** : Contrairement aux frameworks synchrones classiques, FastAPI supporte nativement la programmation asynchrone (`async/await`). C'est un atout non négligeable pour ce projet qui effectue de nombreux appels réseau bloquants (requêtes HTTP vers WorldNewsAPI et requêtes réseau vers le LLM de Mistral). Grâce à l'asynchronisme, le thread principal du serveur n'est pas bloqué pendant qu'il attend les réponses des API externes, améliorant les performances globales du serveur.
  **Utilisation** :
  FastAPI intègre un système d'injection de dépendances via le mot-clé `Depends`. Dans NewsFoundry, cela est utilisé pour injecter la session de base de données (`Session = Depends(get_db)`) ou l'utilisateur actuellement authentifié (`User = Depends(get_current_user)`).

### B. SQLModel (ORM)

- **Justification** : SQLModel combine SQLAlchemy (la puissance des requêtes SQL) et Pydantic (la validation de données).
  **Utilisation** :
  En utilisant SQLModel, les classes des modèles (comme `User` ou `Chat`) servent à la fois à définir les tables en base de données et à valider les formats de données de l'API. Cela évite d'avoir à dupliquer et à maintenir deux structures de données distinctes pour chaque entité.

### C. PydanticAI (Gestion des Agents IA)

- **Justification** : PydanticAI permet d'instancier des agents de manière type-safe.
  **Utilisation** :
  _Outils typés (Tools)_ : L'agent de chat `chat_agent` dispose d'un outil de recherche `search_news`. Le LLM décide de l'invoquer en cas de besoin et PydanticAI valide les types des arguments transmis.
  _Réponses structurées_ : Pour l'agent de revue de presse `press_review_agent`, un format de sortie est défini avec le paramètre `output_type=PressReviewResponse`. Le LLM est ainsi contraint de retourner une réponse au format JSON validé par un modèle Pydantic, garantissant une structure constante et exploitable par le frontend (titre, lead, articles).

---

## 2. Tableaux de Référence des Dépendances Réelles

### A. Dépendances du Backend (`backend/pyproject.toml`)

| Dépendance              | Catégorie                 | Rôle et Utilité dans le Projet                                                                                           |
| :---------------------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------- |
| **`fastapi`**           | Core Backend              | Framework web asynchrone utilisé pour concevoir et exposer l'API REST.                                                   |
| **`uvicorn[standard]`** | Serveur Web               | Serveur ASGI à haute performance utilisé pour faire tourner l'application FastAPI.                                       |
| **`sqlmodel`**          | Base de données           | ORM unifiant SQLAlchemy et Pydantic pour interagir proprement avec la base de données.                                   |
| **`psycopg2-binary`**   | Base de données           | Pilote PostgreSQL permettant la connexion physique du serveur à la base de données de production.                        |
| **`bcrypt`**            | Sécurité                  | Algorithme de hachage unidirectionnel utilisé pour stocker de manière sécurisée les mots de passe des utilisateurs.      |
| **`PyJWT`**             | Sécurité                  | Bibliothèque d'encodage et de décodage des JSON Web Tokens (JWT) pour l'authentification sans état (stateless).          |
| **`pydantic-ai`**       | Intelligence Artificielle | Framework d'orchestration d'agents d'intelligence artificielle pour simplifier les appels au LLM et la gestion d'outils. |

### B. Dépendances du Frontend (`frontend/package.json`)

| Dépendance                     | Catégorie          | Rôle et Utilité dans le Projet                                                                                                  |
| :----------------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **`next`**                     | Core Frontend      | Framework React avec rendu hybride et gestion des routes par dossier (App Router).                                              |
| **`react` & `react-dom`**      | Core Frontend      | Bibliothèque de composants UI et gestion dynamique du DOM.                                                                      |
| **`lucide-react`**             | Iconographie       | Ensemble d'icônes vectorielles modernes et légères utilisées pour illustrer l'interface (chat, boutons, menu).                  |
| **`react-markdown`**           | Rendu de texte     | Permet de restituer proprement sous forme de HTML le format Markdown généré par l'IA (dans le chat et pour la revue de presse). |
| **`sonner`**                   | UX / Notifications | Système de toasts (notifications éphémères) pour avertir l'utilisateur en cas de succès ou d'erreur.                            |
| **`next-themes`**              | UX / Style         | Permet de gérer facilement la bascule dynamique entre le thème clair et le thème sombre.                                        |
| **`tailwind-merge` & `clsx`**  | Style              | Utilitaires permettant de fusionner et de manipuler conditionnellement les classes CSS Tailwind CSS sans conflits.              |
| **`class-variance-authority`** | Style              | Permet de définir des variantes de styles structurées pour nos composants graphiques réutilisables.                             |
| **`shadcn/ui`**                | Accessibilité      | Bibliothèque de composants réutilisables, accessibles et personnalisables.                                                      |

---

## 3. Paramètres des Prompts

La qualité des réponses de l'IA repose sur une structuration via des prompts système qui sont définis de manière dynamique en fonction du besoin des fonctionnalités.

### A. Attribution de Personas

Chaque agent se voit attribuer une posture professionnelle précise dès le début de son prompt :

- `resume_agent` ➡️ _« You are a news editor »_ (Éditeur d'actualités).
- `chat_agent` ➡️ _« You are the news foundry assistant »_ (Assistant de rédaction).
- `press_review_agent` ➡️ _« You are a professional press review editor »_ (Rédacteur de revues de presse).
- **Pourquoi ce choix ?** Définir un rôle clair permet d'orienter le modèle de langage vers un vocabulaire, un ton (neutre, factuel) et un style de rédaction propres au milieu du journalisme professionnel. Séparer leur responsabilité permet également d'adapter plus facilement leurs prompts sans affecter les autres agents et d'améliorer leurs résultats.

Pour comprendre plus en détails leurs rôles, voir `docs/architecture.md` ou `docs/Diagramme agent.pdf`.

### B. Outils

`chat_agent` dispose d'un outil de recherche `search_news` qui permet de récupérer les actualités les plus récentes sur un sujet donné.

### C. Garde-fous et Consignes Négatives

Pour éviter les dérives d'utilisation, règles restrictives sont en place :

- **Filtre thématique (Chat)** : La consigne _« FOCUS ON NEWS AND JOURNALISM : [...]»_ force le modèle à refuser poliment de répondre aux questions qui ne concernent pas l'actualité ou les médias (ex: demande de code, recettes de cuisine).
- **Contrôle du style (Revue de presse)** : L'interdiction d'utiliser des expressions d'introduction auto-référencées (ex: _« Cette revue de presse présente... »_, _« Voici un résumé... »_). Cela force le LLM à entrer directement dans le vif du sujet avec un titre et un chapeau journalistique réalistes.

### D. Ancrage Strict contre l'Hallucination

La génération d'une revue de presse présente un risque d'hallucination (l'IA invente des faits) ou d'écrire un sujet qui n'est pas dans le thème choisi.
Le prompt de l'agent de revue de presse contient des consignes de bridage :

- **Source exclusive** : _« You must build the press review using ONLY the information and articles explicitly discussed... »_. L'IA n'a pas le droit d'utiliser ses connaissances pré-entraînées. De plus il ne possède que les messages écrit pendant la conversation.
- **Gestion de l'absence de données** : Si le sujet n'a pas été abordé, l'agent doit renvoyer une liste d'articles vide `[]` et un titre d'erreur. Cela évite que l'IA ne génère de fausses actualités par peur de laisser un champ vide.
- **Formatage strict** : L'agent doit retourner une réponse au format JSON validé par Pydantic. Cela garantit que l'IA retourne toujours une structure de réponse constante et exploitable par le frontend (titre, résumé, liste d'articles avec titre et pertinence).

---

## 4. Gestion des Langues

Pour assurer la cohérence du projet, la politique linguistique est la suivante :

1.  **Code Source & Base de données (Anglais)** : L'ensemble du code (variables, fonctions, modèles ORM, noms des tables) est écrit en anglais, respectant les standards professionnels de développement.
2.  **Commentaire du code (Français)** : Les commentaires sont écrit en Français pour faciliter la compréhension du code.
3.  **Interface Utilisateur & Contenu IA (Français)** : NewsFoundry étant destiné à un public francophone, les interactions de l'agent de chat, la synthèse des actualités, les revues de presse générées ainsi que les chemins sont rédigées en français.
4.  **Messages d'Erreurs (Hybride)** :
    - Les erreurs techniques destinées aux développeurs (ex: `Chat not found` ou `Could not validate credentials`) restent en anglais.
    - Les erreurs affichées directement à l'utilisateur final (ex: `Email ou mot de passe incorrect.`) sont traduites en français.
