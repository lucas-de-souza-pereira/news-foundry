from pydantic_ai import ModelMessage
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict, Any, Optional

#  auth
class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    email: str | None = None




# chats

class MessageRead(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime | str] = None

class ChatRead(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    history: List[MessageRead]

    model_config = {
        "from_attributes": True
    }

class ChatCreateRequest(BaseModel):
    first_message: str

class ChatCreateResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    history: List[ModelMessage]

class ChatShortResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime


class MessageSendRequest(BaseModel):
    content: str

class MessageSendResponse(BaseModel):
    response: MessageRead


# news
class NewsArticleResponse(BaseModel):
    title: str
    summary: str



# press review

class PressReviewCreateRequest(BaseModel):
    subject: str


class ArticleSynthesis(BaseModel):
    title: str
    summary: str 


class PressReviewResponse(BaseModel):
    title: str = Field(
        ..., 
        description="The title must strictly follow the format: 'REVUE DE PRESSE [SUBJECT IN UPPERCASE] - [Day Month_in_French Year]' e.g., 'REVUE DE PRESSE FOOTBALL - 30 Septembre 2025'"
    )
    subject: str
    general_summary: str
    articles: List[ArticleSynthesis]
    created_at: Optional[datetime] = None