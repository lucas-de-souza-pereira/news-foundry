export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
  },
  CHAT: {
    START: "/api/chats",
    GET_ALL: "/api/chats",
    GET: (id: number) => `/api/chats/${id}`,
    SEND_MESSAGE: (id: number) => `/api/chats/${id}/messages`,
  },
} as const;

export const APP_ROUTES = {
  HOME: "/accueil",
  LOGIN: "/connexion",
  CHAT: (id: number) => `/chat/${id}`,
  PRESS_REVIEW: "/revue-de-presse",
} as const;
