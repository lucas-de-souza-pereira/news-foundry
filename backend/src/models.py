from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str = Field()

# class AiModel(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     model_name: str = Field(unique=True, index=True)

class SenderRole (SQLModel, table=True):
    role: str = Field(primary_key=True, unique=True, index=True)

# class PromptSystem(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     model_id: int = Field(foreign_key="aimodel.id")
#     date: datetime = Field(default_factory=datetime.utcnow)
#     prompt: str = Field()

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    # prompt_id: int = Field(foreign_key="promptsystem.id")
    date: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str = Field(foreign_key="senderrole.role")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    content: str = Field()



