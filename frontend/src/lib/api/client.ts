const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type FetchOptions = RequestInit & {
  token?: string;
};

interface ValidationErrorDetail {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((fetchOptions.headers as Record<string, string>) ?? {}),
  };

  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...fetchOptions,
      headers,
    });
  } catch {
    throw new Error(
      "Impossible de contacter le serveur. Veuillez vérifier votre connexion ou le statut du serveur.",
    );
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {}

  if (res.status === 401 && !path.includes("/auth/")) {
    if (typeof window !== "undefined") {
      const { StorageUtility, StorageKeys } =
        await import("@/lib/local-storage");
      StorageUtility.removeItem(StorageKeys.SESSION_TOKEN);
      window.location.href = "/connexion?expired=1";
      return {} as T;
    }
  }

  if (!res.ok) {
    const errorData = data as { detail?: unknown; message?: string } | null;
    let errorMessage = `HTTP error ${res.status}`;
    if (errorData) {
      if (errorData.detail) {
        if (typeof errorData.detail === "string") {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail
            .map((err: ValidationErrorDetail) => {
              const location = err.loc ? err.loc.join(".") : "";
              const message = err.msg || "Validation error";
              return location ? `${location}: ${message}` : message;
            })
            .join(", ");
        } else {
          errorMessage = JSON.stringify(errorData.detail);
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }
    throw new Error(errorMessage);
  }

  return data as T;
}
