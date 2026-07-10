# Guide des Tests et Intégration Continue

Ce document explique le fonctionnement de la suite de tests automatisés de **NewsFoundry**, comment exécuter les tests localement et comment l'intégration continue (GitHub Actions) garantit la stabilité et la sécurité de l'application à chaque modification de code.

---

## 1. Lancement des Tests

### Commandes pour exécuter les tests

Vous pouvez lancer la suite de tests grâce aux commandes suivantes :

- **Exécuter tous les tests** :

  ```bash
  uv run pytest -vv
  ```

- **Exécuter un test spécifique** :
  ```bash
  uv run pytest tests/test_chat.py -k "test_create_chat_success"
  ```

---

## 2. Choix d'Implémentation de la Suite de Tests

### A. SQLite en mémoire (`sqlite:///:memory:`)

Pour éviter d'avoir besoin d'une base de données PostgreSQL en cours d'exécution lors des tests (ce qui ralentit les tests et complique le setup de la CI), SQLite est utilisé en mémoire.

#### Comment cela fonctionne ?

Dans `backend/tests/conftest.py` :

- L'URL de connexion est configurée sur `sqlite:///:memory:`.
- Pour un pool de connexions statique, `StaticPool` (`sqlalchemy.pool.StaticPool`) est utilisé. C'est un paramètre critique : par défaut, SQLite en mémoire détruit la base dès qu'une connexion se ferme. `StaticPool` maintient une connexion persistante tout au long du cycle de vie du test afin que les différentes requêtes HTTP partagent la même base temporaire.
- **Fixture `session`** : À chaque début de test, toutes les tables de la base de données sont créées (`SQLModel.metadata.create_all`). À la fin du test, elles sont nettoyées et détruites (`SQLModel.metadata.drop_all`). Cela assure une isolation entre les tests (un test ne peut pas être pollué par les données écrites par un test précédent).

---

### B. Mocks pour les services externes (LLM et API)

Pendant les tests, pour éviter d'appeler l'API payante de Mistral AI ou de saturer le quota de WorldNewsAPI,

des simulations (Mocks / TestModels) sont utilisées :

1.  **Mock de PydanticAI** :
    Le modèle d'intelligence artificielle est remplacé par le modèle de test intégré de PydanticAI (`pydantic_ai.models.test.TestModel`) :
    ```python
    from pydantic_ai.models.test import TestModel
    chat_agent.model = TestModel(custom_output_text="Réponse simulée du LLM.")
    resume_agent.model = TestModel(custom_output_text="Résumé simulé du LLM.")
    ```
    Ainsi, aucun appel réseau vers Mistral n'est passé et les tests s'exécutent instantanément.
2.  **Mock de WorldNewsAPI** :
    Le décorateur `unittest.mock.patch` est utilisé pour intercepter les requêtes vers l'API de news et renvoyer une liste fixe d'articles simulés :
    ```python
    @pytest.fixture(autouse=True)
    def mock_get_top_news():
        with patch("agent.system_prompt.get_top_news", new_callable=AsyncMock) as mock:
            mock.return_value = [
                NewsArticleResponse(title="Actu Test 1", summary="Résumé Test 1")
            ]
            yield mock
    ```

---

## 3. Test de Sécurité : L'Isolation des Utilisateurs

Pour vérifier qu'un utilisateur n'a pas accès au profil d'un autre utilisateur, un test est réalisé pour vérifier que le systeme protége bien et empeche l'accès aux données.

### Exemple de Test d'Accès non autorisé (`test_get_chat_by_id_unauthorized_access`)

Ce test vérifie qu'un utilisateur A ne peut pas lire le chat de l'utilisateur B :

```python
@pytest.mark.asyncio
async def test_get_chat_by_id_unauthorized_access(
    client: AsyncClient,
    auth_headers_user_2: dict[str, str], # En-têtes pour l'utilisateur 2
    test_user_1: User,                  # Utilisateur 1 créé en BDD
    session: Session
):
    # 1. Création d'un chat associé à l'utilisateur 1
    chat_user_1 = Chat(user_id=test_user_1.id, history=[])
    session.add(chat_user_1)
    session.commit()

    # 2. Tentative de l'utilisateur 2 d'appeler l'API pour lire le chat de l'utilisateur 1
    response = await client.get(
        f"/api/chats/{chat_user_1.id}",
        headers=auth_headers_user_2
    )

    # 3. L'API doit retourner une erreur 403 Forbidden
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not have access to this chat"
```

Le même principe est appliqué pour l'envoi de messages (`test_send_message_unauthorized_access`), garantissant qu'un utilisateur malveillant ne peut pas injecter de messages dans un fil qui ne lui appartient pas.

---

## 4. Intégration Continue (GitHub Actions)

Pour s'assurer qu'aucune régression (notamment de sécurité) n'est poussée en production, un workflow GitHub Action est configuré dans le fichier `.github/workflows/pytest.yml`.

À chaque fois qu'un développeur effectue un **`push`** ou ouvre une **`pull request`** sur les branches `main` ou `master` :

1.  Un conteneur virtuel Linux (Ubuntu) est provisionné.
2.  Python 3.13 et l'utilitaire **`uv`** sont installés et configurés avec mise en cache des dépendances (pour accélérer les builds futurs).
3.  Les dépendances du backend sont installées.
4.  Les variables d'environnement de test sont injectées (notamment des fausses clés secrètes pour empêcher l'application de crasher au démarrage).
5.  Les tests unitaires sont lancés via la commande `uv run pytest -vv`.
6.  Si l'un des tests échoue, le pipeline passe au rouge, alertant l'équipe et bloquant tout déploiement automatique.
