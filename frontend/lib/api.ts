// Small client for the Hue&Me FastAPI backend.
// Set NEXT_PUBLIC_API_URL in .env.local (e.g. your Railway URL once deployed).

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

const TOKEN_KEY = "token";
const EMAIL_KEY = "user_email";
const NAME_KEY = "user_name";
const ROLE_KEY = "user_role";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface TokenOut {
  access_token: string;
  role: "user" | "admin" | string;
  token_type: string;
}

export interface Me {
  id?: number;
  user_id?: number;
  email: string;
  role: string;
}

// ---------- session (localStorage) ----------

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function saveSession(token: TokenOut, email: string) {
  localStorage.setItem(TOKEN_KEY, token.access_token);
  localStorage.setItem(ROLE_KEY, token.role);
  localStorage.setItem(EMAIL_KEY, email);
  if (!localStorage.getItem(NAME_KEY)) {
    localStorage.setItem(NAME_KEY, email.split("@")[0]);
  }
}

export function clearSession() {
  [TOKEN_KEY, ROLE_KEY, EMAIL_KEY, NAME_KEY].forEach((k) => localStorage.removeItem(k));
}

// ---------- fetch wrapper ----------

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method || (options.body !== undefined ? "POST" : "GET"),
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Is the backend running?", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // FastAPI sends either a string or a list of validation errors in `detail`
    const d = (data as { detail?: unknown }).detail;
    const message = Array.isArray(d)
      ? d.map((e: { msg?: string }) => (e.msg || "").replace(/^Value error, /, "")).join(", ")
      : typeof d === "string"
        ? d
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return data as T;
}

// ---------- auth endpoints (/auth on the backend) ----------

export const auth = {
  signup: (email: string, password: string) =>
    api<{ message: string }>("/auth/signup", { body: { email, password } }),

  verifySignup: (email: string, otp: string) =>
    api<TokenOut>("/auth/verify-signup", { body: { email, otp } }),

  login: (email: string, password: string) =>
    api<TokenOut>("/auth/login", { body: { email, password } }),

  forgotPassword: (email: string) =>
    api<{ message: string }>("/auth/forgot-password", { body: { email } }),

  resetPassword: (email: string, otp: string, new_password: string) =>
    api<{ message: string }>("/auth/reset-password", { body: { email, otp, new_password } }),

  me: () => api<Me>("/auth/me", { auth: true }),
};
