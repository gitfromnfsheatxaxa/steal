/**
 * Typed fetch wrapper for the backend.
 *
 * Single source of truth for outbound HTTP:
 *   - Base URL from NEXT_PUBLIC_API_URL (no hardcoded hosts).
 *   - Consistent ApiError shape so UI can branch on loading / error / empty.
 *   - Retries idempotent requests on network/5xx with exponential backoff.
 *   - Designed to slot into TanStack Query:
 *       useQuery({ queryKey: ['users'], queryFn: () => api.get<User[]>('/users') })
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  // Fail loud at module load rather than letting every request 404 silently.
  // eslint-disable-next-line no-console
  console.warn("[api] NEXT_PUBLIC_API_URL is not set — check .env.local");
}

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly body: unknown;

  constructor(message: string, opts: { status: number; url: string; body: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.url = opts.url;
    this.body = opts.body;
  }
}

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON body — will be stringified and get correct Content-Type. */
  json?: Json;
  /** Query string params, serialized in stable order. */
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Max retry attempts for network errors / 5xx. Default 2 (3 total tries). */
  retries?: number;
  /** Starting backoff in ms; doubles each retry. Default 300. */
  retryBackoffMs?: number;
  /** AbortSignal — honored through retries. */
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = (BASE_URL ?? "").replace(/\/+$/, "");
  const rel = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${rel}`;
  if (!query) return url;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    usp.append(k, String(v));
  }
  const qs = usp.toString();
  return qs ? `${url}?${qs}` : url;
}

async function parseBody(res: Response): Promise<unknown> {
  const ctype = res.headers.get("content-type") ?? "";
  if (res.status === 204 || res.headers.get("content-length") === "0") return null;
  if (ctype.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  return await res.text();
}

function shouldRetry(status: number | null): boolean {
  // Network error -> status null. Retry server errors + 429.
  if (status === null) return true;
  if (status === 429) return true;
  return status >= 500 && status <= 599;
}

async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      };
      if (signal.aborted) onAbort();
      else signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const {
    json,
    query,
    retries = 2,
    retryBackoffMs = 300,
    headers,
    signal,
    ...init
  } = opts;

  const url = buildUrl(path, query);
  const finalHeaders = new Headers(headers);
  if (json !== undefined && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (!finalHeaders.has("Accept")) {
    finalHeaders.set("Accept", "application/json");
  }

  const requestInit: RequestInit = {
    ...init,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : (init as RequestInit).body,
    signal,
  };

  let attempt = 0;
  // Loop bounds: 1 initial attempt + `retries` retries.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch(url, requestInit);
      if (!res.ok) {
        const body = await parseBody(res);
        if (attempt < retries && shouldRetry(res.status)) {
          await sleep(retryBackoffMs * 2 ** attempt, signal);
          attempt++;
          continue;
        }
        throw new ApiError(`${res.status} ${res.statusText}`, {
          status: res.status,
          url,
          body,
        });
      }
      return (await parseBody(res)) as T;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if ((err as { name?: string }).name === "AbortError") throw err;
      // Network failure
      if (attempt < retries && shouldRetry(null)) {
        await sleep(retryBackoffMs * 2 ** attempt, signal);
        attempt++;
        continue;
      }
      throw new ApiError("Network request failed", {
        status: 0,
        url,
        body: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, json?: Json, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", json }),
  put: <T>(path: string, json?: Json, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PUT", json }),
  patch: <T>(path: string, json?: Json, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PATCH", json }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
