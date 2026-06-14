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
from utils.routes import API_BASE_ROUTE

router = APIRouter(
    prefix=API_BASE_ROUTE["chats"],
    tags=["Chats"]
)

agent = chat_agent

@router.post("", response_model=ChatCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(
    payload: ChatCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a new empty chat thread for the logged-in user.
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


@router.get("", response_model=List[ChatShortResponse])
def get_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves all chats for the logged-in user.
    """
   
    chats = db.exec(
        select(Chat)
        .where(Chat.user_id == current_user.id)
        .order_by(desc(Chat.created_at))
    ).all()

    return chats


@router.get("/{chat_id}", response_model=ChatRead)
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the complete chat history for a specific chat ID.
    Enforces authorization: users can only read their own chats.
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



@router.post("/{chat_id}/messages", response_model=MessageSendResponse)
async def send_message(
    chat_id: int,
    payload: MessageSendRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Appends a new user message to the chat history, sends it to PydanticAI (Mistral),
    saves the updated history to the database, and returns the AI's reply.
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