// API
import { apiFetch } from "@/lib/api/client";

// Utils
import { ActionResult } from "@/lib/validation/action";

// Routes
import { API_ROUTES } from "@/lib/routes";

// Types
import {
  ChatCreateResquest,
  ChatResponse,
  ChatDetailResponse,
  MessageSendRequest,
  MessageSendResponse,
  ChatDetailRequest,
} from "../validation/chat";
import { AuthToken } from "../validation/auth";

export async function startChatAction(
  request: ChatCreateResquest,
  token: AuthToken,
): Promise<ActionResult<ChatResponse>> {
  try {
    const data = await apiFetch<ChatResponse>(API_ROUTES.CHAT.START, {
      method: "POST",
      body: JSON.stringify(request),
      token,
    });

    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la création de la conversation";
    return { success: false, error: message };
  }
}

export async function getAllChatAction(
  token: AuthToken,
): Promise<ActionResult<ChatResponse[]>> {
  try {
    const data = await apiFetch<ChatResponse[]>(API_ROUTES.CHAT.GET_ALL, {
      method: "GET",
      token,
    });

    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des conversations";
    return { success: false, error: message };
  }
}

export async function getChatAction(
  request: ChatDetailRequest,
  token: AuthToken,
): Promise<ActionResult<ChatDetailResponse>> {
  try {
    const data = await apiFetch<ChatDetailResponse>(
      API_ROUTES.CHAT.GET(request.chat_id),
      {
        method: "GET",
        token,
      },
    );
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des conversations";
    return { success: false, error: message };
  }
}

export async function sendMessageAction(
  request: MessageSendRequest,
  token: AuthToken,
): Promise<ActionResult<MessageSendResponse>> {
  try {
    const data = await apiFetch<MessageSendResponse>(
      API_ROUTES.CHAT.SEND_MESSAGE(request.chat_id),
      {
        method: "POST",
        body: JSON.stringify(request),
        token,
      },
    );
    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de l'envoi du message";
    return { success: false, error: message };
  }
}
