from agent import chat_agent
from groq.types import chat
from utils.mapping import map_history_to_frontend
from openai.types.responses import response_web_search_call_completed_event
import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, desc
from database import get_db
from models import Chat, User
from routers.auth import get_current_user
from schemas import ChatRead, ChatCreateResponse, MessageSendRequest, ChatCreateRequest, ChatShortResponse, MessageSendResponse
from pydantic_ai import Agent, ModelMessagesTypeAdapter
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

    try : 
        result = await agent.run(payload.first_message, message_history=[])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calling AI model: {str(e)}"
        )
    
    new_messages = json.loads(result.new_messages_json())

    new_chat = Chat(
        user_id = current_user.id,
        history= new_messages
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
    
    try:
        message_history = ModelMessagesTypeAdapter.validate_python(chat.history)
    except Exception:
        message_history = []
    
    try:
        result = await agent.run(payload.content, message_history=message_history)
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