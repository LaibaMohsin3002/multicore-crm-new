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
  
  // Handle 401 Unauthorized - token expired or invalid
  if (res.status === 401) {
    localStorage.removeItem("token");
    // Redirect to login if not already there
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/';
    }
    throw new Error("Session expired. Please login again.");
  }
  
  if (!res.ok) {
    let errorMessage = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      // Try to extract error message from response
      if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
    } catch {
      // If JSON parsing fails, try text
      const text = await res.text();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          errorMessage = parsed.message || parsed.error || text;
        } catch {
          errorMessage = text || errorMessage;
        }
      }
    }
    throw new Error(errorMessage);
  }
  return (await res.json()) as T;
}

// Auth helpers
export async function login(email: string, password: string) {
  const data = await apiFetch<{ token: string; success?: boolean; message?: string }>(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.success === false) {
    throw new Error(data.message || "Login failed");
  }
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

export async function registerCustomer(payload: {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}) {
  const data = await apiFetch<{ success?: boolean; message?: string }>(`/api/auth/register/customer`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data.success === false) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
}

export async function me() {
  return apiFetch(`/api/auth/me`, { auth: true });
}
