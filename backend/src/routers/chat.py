
from utils.routes import API_BASE_ROUTE, CHAT_ROUTES
from routers.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import ConversationStartRequest, ConversationRead
from database import get_db
from models import Conversation, User, Message 
from sqlmodel import Session
from datetime import datetime


router = APIRouter(
    prefix=API_BASE_ROUTE["chat"],
    tags=["Chat"]
)

@router.post(CHAT_ROUTES["conversations"], status_code=status.HTTP_201_CREATED, response_model=ConversationRead)

def start_conversation(
    payload: ConversationStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    conversation = Conversation(
        user_id=current_user.id,
        date=datetime.utcnow(),
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    message = Message(
        conversation_id=conversation.id,
        content=payload.first_message,
        role="user",
        created_at=datetime.utcnow(),
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return conversation