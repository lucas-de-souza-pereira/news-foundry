export interface ChatCreateResquest {
  first_message: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface MessageSendRequest {
  chat_id: number;
  content: string;
}

export interface Chat {
  id: number;
  user_id: number;
  created_at: string;
}
export type ChatResponse = Chat;

export interface ChatDetail extends Chat {
  history: ChatMessage[];
}

export interface ChatDetailRequest {
  chat_id: number;
}
export type ChatDetailResponse = ChatDetail;

export type MessageSendResponse = {
  response: ChatMessage;
};
