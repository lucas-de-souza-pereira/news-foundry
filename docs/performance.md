# Rapport d'Analyse de Performance et d'Optimisation des Agents (MLOps)

Ce document présente l'analyse de performance de nos agents d'intelligence artificielle obtenue grâce au traçage de **MLflow**, formule un regard critique sur la réactivité de l'application et propose des pistes d'amélioration concrètes et réalisables.

---

## 1. Analyse des Mesures Réelles (Traces MLflow)

Grâce à l'intégration d'OpenTelemetry et de l'auto-logging de PydanticAI avec MLflow, nous avons capturé les temps d'exécution réels de nos agents lors du démarrage d'une conversation et des échanges :

| Agent ciblé              | Rôle / Prompt Utilisateur                                           | Volume de Tokens  | Temps d'exécution      | Statut |
| :----------------------- | :------------------------------------------------------------------ | :---------------- | :--------------------- | :----- |
| **`resume_agent`**       | Initialisation quotidienne (Top actualités brutes) (jour 1)         | **35 794 tokens** | **9.497 secondes**     | `OK`   |
| **`resume_agent`**       | Initialisation quotidienne (Top actualités brutes) (jour 2)         | **27 492 tokens** | **12.572 secondes**    | `OK`   |
| **`chat_agent`**         | _« Quelles sont les nouvelles du jour ? »_ (Création)               | **2 757 tokens**  | **5.604 secondes**     | `OK`   |
| **`chat_agent`**         | _« Quelles sont les nouvelles du jour ? »_ (Répétition)             | **2 831 tokens**  | **6.402 secondes**     | `OK`   |
| **`chat_agent`**         | _« Quelles sont les nouvelles sportives »_ (Ciblé)                  | **3 990 tokens**  | **3.697 secondes**     | `OK`   |
| **`chat_agent`**         | _« parle moi de Politique internationale »_                         | **3 399 tokens**  | **3.668 secondes**     | `OK`   |
| **`chat_agent`**         | _« parle moi de tout ce qui concerne la Turquie »_                  | **11 921 tokens** | **6.113 secondes**     | `OK`   |
| **`chat_agent`**         | _« fais le résumé de ce qui s'est passé au Moyen... »_              | **7 165 tokens**  | **4.131 secondes**     | `OK`   |
| **`chat_agent`**         | _« résultat du match france paraguay »_ (Tools/Succès)              | **5164 tokens**   | **2.414 secondes**     | `OK`   |
|                          | \_«dis moi en plus sur : Apple : La justice européenne confirme     |                   |                        |        |
| **`chat_agent`**         | l’application du règlement sur les marchés numériques (DMA) à l’App | **8043 tokens**   | **6.357 secondes**     | `OK`   |
|                          | Store et iOS » (Tools/Succès)                                       |                   |                        |        |
| **`press_review_agent`** | Génération de la revue de presse (Moyen-Orient)                     | **6 239 tokens**  | **2.7 à 3.0 secondes** | `OK`   |

### Analyse critique des résultats et de l'expérience utilisateur (UX) :

1. **La latence du démarrage à froid (_Cold Start_)** :
   Le premier utilisateur de la journée subit un temps d'attente cumulé critique de **15 à 18 secondes** lors de son premier message. Ce temps correspond à la somme du pré-calcul du prompt quotidien (`resume_agent` : ~9.5s/12.5s pour 35k/27k tokens) et de la génération de la première réponse de chat (`chat_agent` : ~5.6s à 6.4s). C'est le goulot d'étranglement majeur de l'application.
2. **Utilisation de l'outil search_news (2s à 6.3s / 2757 tokens à 8k tokens)** :
   Lorsque l'utilisateur demande des détails sur une question l'agent peut appeller son outil `search_news` qui retourne les actualités demandées.
   Le temps de réponse situé entre 2s et 6.3s peut évalent comparé à une réponse classique.
3. **Le temps de génération des revues de presse (2.7s - 3.0s)** :
   Le temps de génération de la revue de presse structurée est très satisfaisant (autour de 3 secondes). L'agent extrait rapidement le contenu pertinent de l'historique épuré de la conversation sans s'éparpiller.

---

## 2. Pistes d'Amélioration et d'Optimisation des Agents

#### Piste 1 : Pré-calcul du Prompt Quotidien

- **Justification** : Éviter les 15 à 16 secondes de latence cumulées subies par le premier utilisateur de la journée lors du démarrage à froid (_Cold Start_), correspondant au calcul du résumé quotidien par `resume_agent` (~9 à 12 secondes) combiné à la première réponse de chat (~6s).
- **Solution proposée** : Exécuter une tâche de fond planifiée chaque matin à 5h00/6h00 UTC qui appelle la génération du prompt quotidien.
- **Bénéfice** : Lorsque le premier utilisateur se connecte, le prompt est déjà calculé et stocké en base de données, ramenant le temps d'initialisation de sa conversation à moins de 50 millisecondes.
- **Réalisation** :
  - Configurer une tâche planifiée de fond pour exécuter la synthèse quotidienne de l'agent de résumé (`resume_agent`) chaque matin à heure fixe.
  - Stocker le prompt quotidien généré en base de données (table `SystemPrompt`).
  - Adapter le service du backend pour servir directement ce prompt pré-calculé à la création des discussions sans relancer de génération d'actualités.

#### Piste 2 : Fluidité d'interaction (Streaming de la génération de l'Agent)

- **Justification** : Attendre 5 à 6 secondes sans aucun retour visuel donne à l'utilisateur l'impression que l'application est figée, ce qui dégrade l'expérience utilisateur.
- **Solution proposée** : Passer l'exécution de l'agent de chat en mode asynchrone par flux de jetons (_Streaming_) en utilisant la méthode `agent.run_stream()` de PydanticAI et des `StreamingResponse` (Server-Sent Events) en FastAPI.
- **Bénéfice** : Réduction de la latence ressentie du premier octet (_Time to First Token_) à moins de 1.5 seconde.
- **Réalisation** :
  - **Backend** : Exposer une route de chat asynchrone renvoyant un flux continu via `agent.run_stream()` (PydanticAI) et une `StreamingResponse` (FastAPI).
  - **Frontend** : Adapter la requête pour consommer le flux d'octets en continu (`ReadableStream`) et afficher le texte mot par mot en temps réel dans l'interface de chat.

#### Piste 3 : Optimisation du contexte d'entrée (RAG local)

- **Justification** : Transmettre l'intégralité du résumé quotidien des actualités (plus de 2 000 tokens) surcharge inutilement le contexte de l'agent de chat, ce qui ralentit la génération et augmente le risque d'hallucinations sémantiques.
- **Solution proposée** : Implémenter un RAG (Retrieval-Augmented Generation) en stockant les articles du jour dans une base de données vectorielle locale. Lors d'une question, effectuer une recherche sémantique pour n'injecter dans le prompt de l'agent que les 3 ou 4 articles les plus pertinents.
  Les données pourrait être stockée pendant 30 jours afin de permettre à l'utilisateur de poser des questions sur les jours précédents.
- **Bénéfice** : Diminution de la taille du contexte, économie de tokens LLM et temps de réponse accéléré et donnée pour le LLM de meilleur qualité car limité au nouvelle du jour.
- **Réalisation** :
  - Intégrer une base de données vectorielle légère et un service de génération d'embeddings.
  - Lors de l'initialisation quotidienne, vectoriser et stocker les articles du jour avec une politique de rétention de 30 jours (purge automatique des anciennes données).
  - Lors d'un message, calculer l'embedding de la question de l'utilisateur, effectuer une recherche de similarité pour en extraire les 3 articles les plus pertinents, et les injecter dynamiquement dans le prompt de l'agent de chat.

#### Piste 4 : Attribution des sources et traçabilité (Ajout des URLs d'origine)

- **Justification** : Actuellement, l'agent de chat et l'agent de revue de presse résument des actualités sans fournir de liens directs vers les articles originaux. L'utilisateur doit croire l'IA sur parole, sans possibilité de vérifier la source ou de lire l'article complet.
- **Solution proposée** : Capturer et transmettre les URLs des articles originaux renvoyées par WorldNewsAPI tout au long du cycle de traitement (base de données, prompts, réponses des agents) pour les rendre cliquables sur le frontend.
- **Réalisation** :
  - **Backend & Schémas** : Modifier le modèle de données des articles pour inclure un champ optionnel `url`.
  - **Prompting** : Demander à l'agent de chat d'ajouter des liens hypertexte Markdown (ex: `[Source](url)`) à la fin de ses affirmations. Ajouter le champ `url` dans la structure de sortie JSON de l'agent de revue de presse.
  - **Frontend** : Rendre les liens cliquables dans les messages de chat et ajouter un bouton _"Lire l'article d'origine"_ sous chaque article de la revue de presse.
