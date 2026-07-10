# NewsFoundry Backend

1. Copier le fichier `.env.example` dans `.env`

2. Installer les dépendances:

```bash
uv sync
```

2. Démarrer la base de données (en arrière-plan avec `-d`) :

**Sur Linux / macOS (Bash) :**

```bash
docker run -d \
  --name newsfoundry_db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=newsfoundry \
  -p 5432:5432 \
  postgres:17
```

**Sur Windows (PowerShell) :**

```powershell
docker run -d `
  --name newsfoundry_db `
  -e POSTGRES_USER=user `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=newsfoundry `
  -p 5432:5432 `
  postgres:17
```

_Note : Une fois le conteneur créé, vous pouvez le gérer avec les commandes suivantes :_

- _Pour l'arrêter :_ `docker stop newsfoundry_db`
- _Pour le relancer :_ `docker start newsfoundry_db`
- _Pour voir les logs :_ `docker logs -f newsfoundry_db`

3. Lancer le backend:

```bash
uv run --env-file .env src/main.py
```

4. Pour lancer les tests :

```bash
uv run pytest -vv
```

5. Pour démarrer l'interface graphique de MLflow sur le port 5000

```bash
uv run --env-file .env mlflow ui --port 5000
```
