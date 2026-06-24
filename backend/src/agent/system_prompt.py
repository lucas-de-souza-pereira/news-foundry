from agent.prompts import CHAT_AGENT_DEPS_PROMPT
from datetime import date
from typing import Optional

from sqlmodel import Session, select

from models import SystemPrompt
from agent.agent import resume_agent
from services.world_news import get_top_news


def get_daily_prompt(db: Session, target_date: date) -> Optional[SystemPrompt]:
    """
    Retourne le prompt enregistré de la date du jour.
    """
    statement = select(SystemPrompt).where(SystemPrompt.target_date == target_date)
    return db.exec(statement).first()



async def create_daily_prompt(db: Session, target_date: date) -> SystemPrompt:
    """
    Récupère les articles via l'API, les synthétise via LLM, et les sauvegarde en base de données.
    """
    raw_news = await get_top_news()
    
    formatted_raw_news = ""
    for news in raw_news:
        formatted_raw_news += f"Title: {news.title}\nSummary: {news.summary}\n\n"
        
    synthesis_result = await resume_agent.run(formatted_raw_news)
    synthesized_text = synthesis_result.output 
    
    new_prompt = SystemPrompt(
        target_date=target_date,
        system_prompt=CHAT_AGENT_DEPS_PROMPT.format(
            target_date=target_date.isoformat(),
            synthesized_text=synthesized_text
            ),
        articles_json=[news.model_dump() for news in raw_news]
    )
    
    db.add(new_prompt)
    db.commit()
    db.refresh(new_prompt)
    
    return new_prompt


async def get_or_create_daily_prompt(db: Session, target_date: date) -> SystemPrompt:
    """
    Retourne le prompt enregistré de la date du jour ou le crée s'il n'existe pas.
    """
    prompt = get_daily_prompt(db, target_date)
    
    if not prompt:
        prompt = await create_daily_prompt(db, target_date)
        
    return prompt