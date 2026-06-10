from pydantic import BaseModel

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


class CreateConversation(BaseModel):
    content:str

class MessageCreate(BaseModel):
    content: str