from pydantic import BaseModel
from datetime import datetime


class LoginRequest(BaseModel):
    # Schema for the login request body, containing email and password
    email: str
    password: str

class Token(BaseModel):
    # Schema representing the token response structure
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    # Schema representing decoded token payload
    email: str | None = None


class ConversationStartRequest(BaseModel):
    first_message:str


class ConversationRead(BaseModel):
    id: int
    user_id: int
    date: datetime
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str