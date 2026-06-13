
from typing import List 

def map_history_to_frontend(history: list) -> list[dict]:
    """
    Transforms PydanticAI's internal message history into a clean format
    for the frontend, hiding system prompts and raw API metadata.
    """
    cleaned_messages = []
    
    for message in history:
        kind = message.get("kind")
        timestamp = message.get("timestamp")
        
        if kind == "request":
            parts = message.get("parts", [])
            for part in parts:
                if part.get("part_kind") == "user-prompt":
                    cleaned_messages.append({
                        "role": "user",
                        "content": part.get("content"),
                        "timestamp": timestamp
                    })
                    
        elif kind == "response":
            parts = message.get("parts", [])
            for part in parts:
                if part.get("part_kind") == "text":
                    cleaned_messages.append({
                        "role": "model",
                        "content": part.get("content"),
                        "timestamp": timestamp
                    })
                    
    return cleaned_messages