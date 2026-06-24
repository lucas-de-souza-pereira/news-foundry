API_BASE_ROUTE = {
    "auth": "/api/auth",
    "chats": "/api/chats"
}

AUTH_ROUTES = {
    "login": "/login",
}

CHAT_ROUTES = {
    "chats": "",
    "chat": "/{chat_id}",
    "chat_messages": "/{chat_id}/messages",
    "generate_press_review": "/{chat_id}/generate-press-review",
    "press_review": "/{chat_id}/press-review"
}