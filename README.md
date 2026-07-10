# NewsFoundry

## Besoins fonctionnels

- L'utilisateur peut se connecter.
- L’utilisateur peut voir la liste de ses discussions passées.
- L’utilisateur peut démarrer une nouvelle discussion ou reprendre une ancienne discussion.
- Un utilisateur n’est pas autorisé à accéder aux discussions d’un autre utilisateur.
- Le LLM répond aux messages envoyés par l’utilisateur.
- L'utilisateur peut faire générer une revue de presse à partir d'une discussion.
- L'application doit afficher des messages d'erreur à l'utilisateur final en cas d'erreur.

## Prérequis

- Docker
- Python 3.13
- uv
- Node.js 22.19

## Installation

1. Cloner le repository
2. Démarrer le backend aved les instructions du fichier `backend/README.md`
3. Initialiser un projet Next.js dans un dossier `frontend/` avec :

```bash
npm install
```

## Choix technologiques

### Frontend

**Next.js**

### Backend

- **Python** pour bénéficier de son écosystème de librairies IA
- **FastAPI** pour le développement de l'API
- Connection avec des **JWT**
- **SQLModel** comme ORM : fait pour bien marcher avec FastAPI.
  - Branché à une base de données **PostgreSQL**
- **PydanticAI** comme client qui s'intégrera aussi bien avec les autres outils de la stack backend
- Attention à la **sécurité des données**. On ne veut pas qu’un utilisateur puisse accéder aux chats d’un autre utilisateur ou les modifier.
  - Le produit aura rapidement beaucoup d’utilisateurs professionnels il est donc crucial de garantir le fonctionnement correct de cette fonctionnalité par l'**implémentation de tests automatisés qui s'exécutent par une Github Action**.
- Pour les sources de news, l’API [**WorldNewsAPI**](https://worldnewsapi.com/) est utilisée.
- Pour le déploiement le frontend est sur **Vercel** et le backend sur **Railway**.

### Documentation

La documentation technique complète du projet est disponible dans le dossier `docs/` :

- [**Architecture & Structure Globale**](docs/architecture.md) : Explique l'organisation générale de la codebase, la séparation des responsabilités entre Next.js et FastAPI, l'arborescence commentée des dossiers et les flux de données.
- [**Guide des Tests**](docs/testing.md) : Détaille comment exécuter les tests localement avec `uv/pytest`, le choix de SQLite en mémoire pour l'isolation, et les tests de sécurité mis en place pour prévenir les failles de type BOLA.
- [**Choix Techniques**](docs/decisions.md) : Présente les justifications technologiques (FastAPI asynchrone, SQLModel, PydanticAI type-safe, shadcn/ui).
- [**Catalogue des Erreurs d'API**](docs/api_errors.md) : Recense tous les codes d'erreur HTTP et messages de détail retournés par le serveur, avec des explications et les comportements recommandés côté frontend pour les gérer.

### Déploiement

Lien vers le frontend sur [Vercel](https://news-foundry-nu.vercel.app/).
