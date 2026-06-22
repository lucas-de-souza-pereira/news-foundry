# librairie standard

from datetime import date
import json
from typing import List, Dict, Any

# librairies externes
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic_ai import Agent, ModelMessagesTypeAdapter
from sqlmodel import Session, select, desc


# imports locaux
# agent
from agent.agent import chat_agent
from agent.system_prompt import get_or_create_daily_prompt
# database
from database import get_db
# models
from models import Chat, User, SystemPrompt
# routes
from routers.auth import get_current_user
# schemas
from schemas import (
    ChatRead, 
    ChatCreateResponse, 
    MessageSendRequest, 
    ChatCreateRequest, 
    ChatShortResponse, 
    MessageSendResponse
)
from utils.mapping import map_history_to_frontend
from utils.routes import API_BASE_ROUTE, CHAT_ROUTES


router = APIRouter(
    prefix=API_BASE_ROUTE["chats"],
    tags=["Chats"]
)

agent = chat_agent

@router.post(CHAT_ROUTES["chats"], response_model=ChatCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(
    payload: ChatCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Créée un nouveau fil de discussion pour l'utilisateur connecté.
    """
    try:
        daily_prompt = await get_or_create_daily_prompt(db, date.today())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating daily system prompt: {str(e)}"
        )

    try : 
        result = await agent.run(payload.first_message,
        message_history=[],
        deps=daily_prompt.system_prompt)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calling AI model: {str(e)}"
        )
    
    new_messages = json.loads(result.new_messages_json())

    new_chat = Chat(
        user_id = current_user.id,
        history= new_messages,
        system_prompt_id=daily_prompt.id
    )

    db.add(new_chat)
    db.commit()
    db.refresh(new_chat) 

    return new_chat


@router.get(CHAT_ROUTES["chats"], response_model=List[ChatShortResponse])
def get_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère tous les fils de discussion de l'utilisateur connecté.
    """
   
    chats = db.exec(
        select(Chat)
        .where(Chat.user_id == current_user.id)
        .order_by(desc(Chat.created_at))
    ).all()

    return chats


@router.get(CHAT_ROUTES["chat"].format(chat_id="{chat_id}"), response_model=ChatRead)
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère l'historique complet d'un fil de discussion spécifique.
    Enforce que seuls les propriétaires peuvent accéder à leurs discussions.
    """
    db_chat = db.get(Chat, chat_id)
    if not db_chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    if db_chat.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this chat"
        )
    
    cleaned_history = map_history_to_frontend(db_chat.history)

    return ChatRead(
        id=db_chat.id,
        user_id=db_chat.user_id,
        created_at=db_chat.created_at,
        history=cleaned_history
    )



@router.post(CHAT_ROUTES["chat_messages"].format(chat_id="{chat_id}"), response_model=MessageSendResponse)
async def send_message(
    chat_id: int,
    payload: MessageSendRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Envoie le message à PydanticAI (Mistral).
    Sauvegarde l'historique mis à jour dans la base de données.
    Retourne la réponse de l'IA.
    """
    chat = db.get(Chat, chat_id)
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    if chat.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this chat"
        )
    
    system_prompt_content = ""
    if chat.system_prompt_id:
        linked_prompt = db.get(SystemPrompt, chat.system_prompt_id)
        if linked_prompt:
            system_prompt_content = linked_prompt.system_prompt



    try:
        message_history = ModelMessagesTypeAdapter.validate_python(chat.history)
    except Exception:
        message_history = []
    
    try:
        result = await agent.run(payload.content, message_history=message_history,deps=system_prompt_content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calling AI model: {str(e)}"
        )
    
    new_messages = json.loads(result.new_messages_json())

    updated_history = list(chat.history)
    updated_history.extend(new_messages)
    
    chat.history = updated_history
    db.add(chat)
    db.commit()

    cleaned_new_messages  = map_history_to_frontend(new_messages)
    agent_response = cleaned_new_messages[-1]

    return MessageSendResponse(
        response=agent_response
    )