# librairie standard

from datetime import timezone
from datetime import datetime
from agent.prompts import PRESS_REVIEW_AGENT_SYSTEM_PROMPT
from datetime import date
import json
from typing import List, Dict, Any

# librairies externes
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic_ai import Agent, ModelMessagesTypeAdapter
from sqlmodel import Session, select, desc
from sqlalchemy import JSON

# imports locaux
# agent
from agent.agent import chat_agent as ca, press_review_agent as pra
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
    MessageSendResponse,
    PressReviewResponse,
    PressReviewCreateRequest
)
# utils
from utils.mapping import map_history_to_frontend
from utils.routes import API_BASE_ROUTE, CHAT_ROUTES


router = APIRouter(
    prefix=API_BASE_ROUTE["chats"],
    tags=["Chats"]
)

chat_agent = ca
press_review_agent = pra

from sqlalchemy import cast, Text

@router.get(CHAT_ROUTES["all_press_reviews"]
, response_model=List[PressReviewResponse])
def get_press_review(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère toutes les revue de presse .
    """
    chats = db.exec(
        select(Chat)
        .where(Chat.user_id == current_user.id)
        .where(Chat.press_review != None)
        .where(cast(Chat.press_review, Text) != 'null')
    ).all()
    
    all_reviews = [chat.press_review for chat in chats if chat.press_review is not None]

    all_reviews.sort(key=lambda r: r.get("created_at") or "", reverse=True)

    return all_reviews


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
        result = await chat_agent.run(payload.first_message,
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
        result = await chat_agent.run(payload.content, message_history=message_history,deps=system_prompt_content)
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


from datetime import date
from schemas import PressReviewCreateRequest, PressReviewResponse
from agent.prompts import PRESS_REVIEW_AGENT_SYSTEM_PROMPT

@router.post(CHAT_ROUTES["generate_press_review"].format(chat_id="{chat_id}"), response_model=PressReviewResponse)
async def generate_press_review(
    chat_id: int,
    payload: PressReviewCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Génère une revue de presse sur un sujet donné en utilisant le chat et les prompts système associés.
    
    Args:
        chat_id (int): ID du fil de discussion.
        payload (PressReviewCreateRequest): Sujet de la revue de presse.
        db (Session): Session de base de données.
        current_user (User): Utilisateur connecté.

    Returns:
        PressReviewResponse: Revue de presse générée.
    """
    print("TEST")
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
    epured_history_json = []
    for msg in chat.history:
        if "parts" in msg:
            new_parts = [
                part for part in msg["parts"]
                if part.get("part_kind") != "system-prompt"
            ]
            if new_parts:
                new_msg = dict(msg)
                new_msg["parts"] = new_parts
                epured_history_json.append(new_msg)
        else:
            epured_history_json.append(msg)

    compiled_system_prompt = PRESS_REVIEW_AGENT_SYSTEM_PROMPT.format(
        subject=payload.subject,
        target_date=chat.created_at.date().isoformat()
    )

    if epured_history_json and epured_history_json[0].get("kind") == "request":
        system_part = {
            "content": compiled_system_prompt,
            "part_kind": "system-prompt"
        }
        epured_history_json[0]["parts"].insert(0, system_part)

    try:
        message_history = ModelMessagesTypeAdapter.validate_python(epured_history_json)
    except Exception:
        message_history = []    

    try:
        result = await press_review_agent.run(
            user_prompt=f"Generate the press review on the subject : {payload.subject}",
            message_history=message_history
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating press review: {str(e)}"
        )

    press_review = result.output

    press_review.created_at = datetime.now(timezone.utc)
    
    chat.press_review = press_review.model_dump(mode='json')
    db.add(chat)
    db.commit()
    db.refresh(chat)

    return press_review


