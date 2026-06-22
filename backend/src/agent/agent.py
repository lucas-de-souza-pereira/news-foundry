from pydantic_ai import Agent, RunContext

resume_agent = Agent(
    'mistral:mistral-small-latest',
    system_prompt="You are a news editor. Synthesize the provided list of daily news articles. "
        "Remove redundancies, group them by main topics, and write a concise, clean summary in French. "
        "Do not include meta-commentary, just the structured news summary."
)

chat_agent = Agent(
    'mistral:mistral-small-latest',
    deps_type=str,
    system_prompt="Tu es l'assistant de l'application web NewsFoundry."
)

@chat_agent.system_prompt
def get_chat_system_prompt(ctx: RunContext[str]) -> str:
     return ctx.deps 