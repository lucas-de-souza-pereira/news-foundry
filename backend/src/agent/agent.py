from agent.prompts import RESUME_AGENT_SYSTEM_PROMPT, CHAT_AGENT_BASE_PROMPT
from schemas import PressReviewResponse
from services.world_news import get_searched_news
from pydantic_ai import Agent, RunContext
from typing import List
from schemas import NewsArticleResponse


resume_agent = Agent(
    'mistral:mistral-small-latest',
    system_prompt=RESUME_AGENT_SYSTEM_PROMPT
)

chat_agent = Agent(
    'mistral:mistral-small-latest',
    deps_type=str,
    system_prompt=CHAT_AGENT_BASE_PROMPT
)

@chat_agent.system_prompt
def get_chat_system_prompt(ctx: RunContext[str]) -> str:
     return ctx.deps 



@chat_agent.tool_plain 
async def search_news(query: str) -> List[NewsArticleResponse]:
    articles = await get_searched_news(query=query)
    return articles   



press_review_agent = Agent(
    'mistral:mistral-small-latest',
    output_type=PressReviewResponse,
    deps_type=str,
)


@press_review_agent.system_prompt
def get_press_review_system_prompt(ctx: RunContext[str]) -> str:
     return ctx.deps 
