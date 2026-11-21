import { authClient } from "./auth-client";

function apiUrl(path: string) {
  return path.startsWith("/api/") ? `/api/backend${path.slice(4)}` : path;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

let cache: { token: string; exp: number } | null = null;
export const clearTokenCache = () => {
  cache = null;
};

async function getToken(force = false) {
  if (!force && cache && cache.exp > Date.now()) return cache.token;
  const { data } = await authClient.token();
  if (!data?.token) throw new ApiError("Please sign in to continue", 401);
  cache = { token: data.token, exp: Date.now() + 10 * 60 * 1000 };
  return data.token;
}

interface Opts {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export async function api<T = unknown>(path: string, { method = "GET", body, auth = true }: Opts = {}): Promise<T> {
  const run = async (force: boolean) => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) headers.Authorization = `Bearer ${await getToken(force)}`;
    return fetch(apiUrl(path), { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  };
  let res: Response;
  try {
    res = await run(false);
    if (res.status === 401 && auth) {
      clearTokenCache();
      res = await run(true);
    }
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError("Network error. Please check your connection.", 0);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.message || "Something went wrong", res.status, data?.code);
  return data as T;
}
