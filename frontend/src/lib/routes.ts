export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
  },
  CHAT: {
    START: "/api/chats/",
    GET_ALL: "/api/chats/",
    GET: (id: number) => `/api/chats/${id}`,
  }
} as const;


export const APP_ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
} as const;