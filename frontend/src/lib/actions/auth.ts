// Routes & Config
import { API_ROUTES } from "@/lib/routes";

// Utilities & Libs
import { apiFetch } from "@/lib/api/client";
import { StorageUtility, StorageKeys } from "@/lib/local-storage";

// Types & Validation
import { LoginCredentials, TokenResponse } from "@/lib/validation/auth";
import { ActionResult } from "@/lib/validation/action";

export async function loginAction(
  credentials: LoginCredentials,
): Promise<ActionResult<TokenResponse>> {
  try {
    const data = await apiFetch<TokenResponse>(API_ROUTES.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    StorageUtility.setItem(StorageKeys.SESSION_TOKEN, data.access_token);

    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la connexion";
    return { success: false, error: message };
  }
}
