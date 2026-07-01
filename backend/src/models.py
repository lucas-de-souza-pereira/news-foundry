from datetime import datetime, timezone, date
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str = Field()

class Chat(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    history: List[Dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    system_prompt_id: Optional[int] = Field(default=None, foreign_key="systemprompt.id")
    press_review: Optional[Dict[str,Any]] = Field(default=None, sa_column=Column(JSON))
    

class SystemPrompt(SQLModel, table = True):
    id: Optional[int] = Field(default=None, primary_key=True)
    target_date: date = Field(unique=True, index=True) 
    system_prompt : str = Field()
    articles_json: List[Dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))