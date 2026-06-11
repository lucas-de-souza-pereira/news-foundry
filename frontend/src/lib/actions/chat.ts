import { apiFetch } from "@/lib/api/client";
import { ActionResult } from "@/lib/validation/action";
import { API_ROUTES } from "@/lib/routes";

export interface MessageCreateRequest {
    first_message: string;
}

export interface ConversationResponse {
    id: number;
    user_id: number;
    date: string;
}

export async function startConversationAction(
    request: MessageCreateRequest,
    token: string,
): Promise<ActionResult<ConversationResponse>> {
    try {
        console.log(request);
        console.log(token);
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

