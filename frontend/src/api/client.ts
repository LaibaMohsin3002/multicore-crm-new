export const apiBase = (import.meta.env.VITE_API_URL as string) || "";

type FetchOptions = RequestInit & { auth?: boolean };

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.auth ? getAuthHeader() : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

// Auth helpers
export async function login(email: string, password: string) {
  const data = await apiFetch<{ token: string }>(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", data.token);
  return data;
}

export async function registerCustomer(payload: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}) {
  return apiFetch(`/api/auth/register/customer`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function me() {
  return apiFetch(`/api/auth/me`, { auth: true });
}
