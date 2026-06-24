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
  PRESS_REVIEW: {
    GET_ALL: "/api/chats/press-reviews",
    GENERATE: (id: number) => `/api/chats/${id}/generate-press-review`,
  },
} as const;

export const APP_ROUTES = {
  HOME: "/accueil",
  LOGIN: "/connexion",
  CHAT: (id: number) => `/chat/${id}`,
  PRESS_REVIEW: "/revue-de-presse",
} as const;
