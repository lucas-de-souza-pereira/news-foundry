from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any

# Authentication Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    email: str | None = None


# Schema to read the full history of a chat
class ChatRead(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    history: List[Dict[str, Any]]

    model_config = {
        "from_attributes": True
    }

# Received when starting a new chat
class ChatCreateRequest(BaseModel):
    first_message: str


# Returned after the chat is created successfully
class ChatCreateResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    history: List[Dict[str, Any]]

class ChatShortResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime


class MessageSendRequest(BaseModel):
    content: str

class MessageSendResponse(BaseModel):
    response: Dict[str,Any]