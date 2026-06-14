from utils.routes import API_BASE_ROUTE, CHAT_ROUTES
import pytest
import json
from httpx import AsyncClient
from sqlmodel import Session, select
from models import Chat, User
from agent import chat_agent
from pydantic_ai.models.test import TestModel

chat_agent.model = TestModel(custom_output_text="Réponse simulée du LLM.")

@pytest.mark.asyncio
async def test_create_chat_success(client: AsyncClient, auth_headers_user_1: dict[str, str], session: Session):
    """
    Test de la création d'une nouvelle discussion (POST /api/chats).
    """
    payload = {"first_message": "Bonjour, je cherche les dernières actualités politiques."}
    
    response = await client.post(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chats"], json=payload, headers=auth_headers_user_1)
    
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert "user_id" in data
    assert "history" in data
    
    db_chat = session.get(Chat, data["id"])
    assert db_chat is not None
    assert db_chat.user_id == data["user_id"]
    assert len(db_chat.history) > 0

@pytest.mark.asyncio
async def test_create_chat_unauthorized(client: AsyncClient):
    """
    Test de création de chat sans être authentifié (doit renvoyer 401).
    """
    payload = {"first_message": "Hello"}
    response = await client.post(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chats"], json=payload)
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_get_chats_list(
    client: AsyncClient, 
    auth_headers_user_1: dict[str, str], 
    auth_headers_user_2: dict[str, str], 
    test_user_1: User, 
    test_user_2: User, 
    session: Session
):
    """
    Test de la liste des discussions (GET /api/chats).
    Chaque utilisateur ne doit voir que ses propres discussions.
    """
    # Création d'une discussion pour user 1 et user 2
    chat_user_1 = Chat(user_id=test_user_1.id, history=[])
    chat_user_2 = Chat(user_id=test_user_2.id, history=[])
    session.add(chat_user_1)
    session.add(chat_user_2)
    session.commit()

    # Appel avec le token de user 1
    response_1 = await client.get(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chats"], headers=auth_headers_user_1)
    assert response_1.status_code == 200
    data_1 = response_1.json()
    assert len(data_1) == 1
    assert data_1[0]["id"] == chat_user_1.id
    assert data_1[0]["user_id"] == test_user_1.id

    # Appel avec le token de user 2
    response_2 = await client.get(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chats"], headers=auth_headers_user_2)
    assert response_2.status_code == 200
    data_2 = response_2.json()
    assert len(data_2) == 1
    assert data_2[0]["id"] == chat_user_2.id
    assert data_2[0]["user_id"] == test_user_2.id

@pytest.mark.asyncio
async def test_get_chat_by_id_owner(
    client: AsyncClient, 
    auth_headers_user_1: dict[str, str], 
    test_user_1: User, 
    session: Session
):
    """
    Test de la récupération d'un chat spécifique par son propriétaire.
    """
    chat = Chat(user_id=test_user_1.id, history=[])
    session.add(chat)
    session.commit()

    response = await client.get(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chat"].format(chat_id=chat.id), headers=auth_headers_user_1)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == chat.id
    assert data["user_id"] == test_user_1.id

@pytest.mark.asyncio
async def test_get_chat_by_id_unauthorized_access(
    client: AsyncClient, 
    auth_headers_user_2: dict[str, str], 
    test_user_1: User, 
    session: Session
):
    """
    Test d'accès à un chat non possédé (renvoie 403 Forbidden).
    """
    chat_user_1 = Chat(user_id=test_user_1.id, history=[])
    session.add(chat_user_1)
    session.commit()

    response = await client.get(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chat"].format(chat_id=chat_user_1.id), headers=auth_headers_user_2)
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not have access to this chat"

@pytest.mark.asyncio
async def test_get_chat_not_found(client: AsyncClient, auth_headers_user_1: dict[str, str]):
    """
    Test de récupération d'un chat inexistant (renvoie 404 Not Found).
    """
    response = await client.get(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chat"].format(chat_id="99999"), headers=auth_headers_user_1)
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_send_message_success(
    client: AsyncClient, 
    auth_headers_user_1: dict[str, str], 
    test_user_1: User, 
    session: Session
):
    """
    Test d'envoi d'un message dans un fil de discussion existant.
    """
    chat = Chat(user_id=test_user_1.id, history=[])
    session.add(chat)
    session.commit()

    payload = {"content": "Peux-tu approfondir ce sujet ?"}
    response = await client.post(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chat_messages"].format(chat_id=chat.id), json=payload, headers=auth_headers_user_1)
    
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["response"]["role"] == "model"
    assert data["response"]["content"] == "Réponse simulée du LLM."

    session.refresh(chat)
    assert len(chat.history) > 0

@pytest.mark.asyncio
async def test_send_message_unauthorized_access(
    client: AsyncClient, 
    auth_headers_user_2: dict[str, str], 
    test_user_1: User, 
    session: Session
):
    """
    Test d'envoi de message dans un chat non possédé (renvoie 403 Forbidden).
    """
    chat_user_1 = Chat(user_id=test_user_1.id, history=[])
    session.add(chat_user_1)
    session.commit()

    payload = {"content": "Message malveillant"}
    response = await client.post(API_BASE_ROUTE["chats"] + CHAT_ROUTES["chat_messages"].format(chat_id=chat_user_1.id), json=payload, headers=auth_headers_user_2)
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not have access to this chat"
