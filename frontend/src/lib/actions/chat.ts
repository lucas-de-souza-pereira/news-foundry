import { apiFetch } from "@/lib/api/client";
import { ActionResult } from "@/lib/validation/action";
import { API_ROUTES } from "@/lib/routes";

export interface MessageCreateRequest {
    first_message: string;
}


export interface ChatMessage {
    role: "user" | "model";
    content: string;
    timestamp: string
}

export interface ConversationResponse {
    id: number;
    user_id: number;
    created_at: string;
}

export async function startConversationAction(
    request: MessageCreateRequest,
    token: string,
): Promise<ActionResult<ConversationResponse>> {
    try {
        const data = await apiFetch<ConversationResponse>(API_ROUTES.CHAT.START, {
            method: "POST",
            body: JSON.stringify(request),
            token,
        });

        return { success: true, data };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "Erreur lors de la création de la conversation";
        return { success: false, error: message };
    }
}

export async function getAllConversationAction(token:string): Promise<ActionResult<ConversationResponse[]>> {
    try{
        const data = await apiFetch<ConversationResponse[]>(API_ROUTES.CHAT.GET_ALL, {
            method: "GET",
            token,
        });

        return { success: true, data };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "Erreur lors de la récupération des conversations";
        return { success: false, error: message };
    }
}


export interface ChatDetailResponse {
    id: number;
    user_id: number;
    created_at: string;
    history: ChatMessage[];
}

export async function getConversationAction(
    token:string, 
    conversation_id: number,
): Promise<ActionResult<ChatDetailResponse>> {
    try{
        const data = await apiFetch<ChatDetailResponse>(API_ROUTES.CHAT.GET(conversation_id), {
            method: "GET",
            token,
            
        });
        console.log("data get conversation", data)
        return { success: true, data };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "Erreur lors de la récupération des conversations";
        return { success: false, error: message };
    }
}