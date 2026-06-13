from pydantic_ai import Agent

news_agent = Agent(
    'mistral:mistral-small-latest',
    system_prompt="tu es l'assistant IA de NewsFoundry. tu aide les utilisateurs à synthétiser les nouvelles du monde et à rédiger des revues de presse."
)