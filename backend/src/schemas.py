from pydantic import BaseModel
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
class ChatRead(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    history: List[Dict[str, Any]]

    model_config = {
        "from_attributes": True
    }

class ChatCreateRequest(BaseModel):
    first_message: str

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
    title: str
    subject: str
    general_summary: str
    articles: List[ArticleSynthesis]
    created_at: Optional[datetime] = None