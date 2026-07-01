// Routes & Config
import { API_ROUTES } from "../routes";

// Utilities & Libs
import { apiFetch } from "../api/client";

// Types & Validation
import { ActionResult } from "../validation/action";
import { AuthToken } from "../validation/auth";
import {
  PressReviewRequest,
  PressReviewResponse,
} from "../validation/press-review";

export async function generatePressReviewAction(
  request: PressReviewRequest,
  token: AuthToken,
): Promise<ActionResult<PressReviewResponse>> {
  try {
    const { subject } = request;
    const data = await apiFetch<PressReviewResponse>(
      API_ROUTES.PRESS_REVIEW.GENERATE(request.chat_id),
      {
        method: "POST",
        body: JSON.stringify({ subject }),
        token,
      },
    );

    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la création de la revue de presse";
    return { success: false, error: message };
  }
}

export async function getAllPressReviewAction(
  token: AuthToken,
): Promise<ActionResult<PressReviewResponse[]>> {
  try {
    const data = await apiFetch<PressReviewResponse[]>(
      API_ROUTES.PRESS_REVIEW.GET_ALL,
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
        : "Erreur lors de la récupération des revues de presse";
    return { success: false, error: message };
  }
}
