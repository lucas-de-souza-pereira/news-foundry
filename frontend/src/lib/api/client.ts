const API_URL = process.env.API_URL ?? "http://localhost:8000";

type FetchOptions = RequestInit & {
  token?: string;
};

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

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
  }

  if (res.status === 401 && !path.includes("/auth/")) {
    const { redirect } = await import("next/navigation");
    redirect("/login?expired=1");
  }

  if (!res.ok) {
    throw new Error(data?.detail ?? data?.message ?? `HTTP error ${res.status}`);
  }

  return data;
}
