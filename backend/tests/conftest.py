import pytest
from typing import Generator, AsyncGenerator
from sqlmodel import SQLModel, Session, create_engine
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
import sys
import os

# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from main import app
from database import get_db
import models
from models import User, Chat
from security import hash_password, create_access_token

from sqlalchemy.pool import StaticPool

DATABASE_URL_TEST = "sqlite:///:memory:"

engine_test = create_engine(
    DATABASE_URL_TEST, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

@pytest.fixture(name="session")
def session_fixture() -> Generator[Session, None, None]:
    """
    Crée une base de données SQLite temporaire en mémoire pour chaque test,
    crée toutes les tables, puis les supprime après l'exécution du test.
    """
    SQLModel.metadata.create_all(engine_test)
    with Session(engine_test) as session:
        yield session
    SQLModel.metadata.drop_all(engine_test)

@pytest.fixture(name="client")
async def client_fixture(session: Session) -> AsyncGenerator[AsyncClient, None]:
    """
    Surcharge la dépendance get_db de FastAPI pour renvoyer la session de test,
    et configure un client HTTP asynchrone pour interagir avec l'application.
    """
    def get_db_override():
        yield session

    app.dependency_overrides[get_db] = get_db_override
    
    async with AsyncClient(
        transport=ASGITransport(app=app), 
        base_url="http://testserver"
    ) as ac:
        yield ac
        
    app.dependency_overrides.clear()

@pytest.fixture
def test_user_1(session: Session) -> User:
    user = User(
        email="user1@test.com",
        hashed_password=hash_password("password123")
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@pytest.fixture
def test_user_2(session: Session) -> User:
    user = User(
        email="user2@test.com",
        hashed_password=hash_password("password123")
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@pytest.fixture
def auth_headers_user_1(test_user_1: User) -> dict[str, str]:
    """
    Génère les en-têtes d'autorisation HTTP Bearer pour l'utilisateur 1.
    """
    token = create_access_token(subject=test_user_1.email)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def auth_headers_user_2(test_user_2: User) -> dict[str, str]:
    """
    Génère les en-têtes d'autorisation HTTP Bearer pour l'utilisateur 2.
    """
    token = create_access_token(subject=test_user_2.email)
    return {"Authorization": f"Bearer {token}"}
