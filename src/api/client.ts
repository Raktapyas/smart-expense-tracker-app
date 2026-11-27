import { API_URL } from '@/config';

export class ApiError extends Error {
  readonly status: number;
  readonly errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  /** First validation message for a field, if the server sent one. */
  fieldError(field: string): string | undefined {
    return this.errors[field]?.[0];
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Query = Record<string, string | number | boolean | null | undefined>;
type RequestOptions = { method?: Method; body?: unknown; query?: Query };
type ErrorBody = { message?: unknown; errors?: unknown };

const TIMEOUT_MS = 20000;

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

/** Called whenever the server answers 401, so the app can sign the user out. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

function buildQuery(query?: Query): string {
  if (!query) {
    return '';
  }

  const parts = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

function isFieldErrors(value: unknown): value is Record<string, string[]> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function api<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError(0, 'The API address is not set. Add EXPO_PUBLIC_API_URL to .env.local and restart Expo.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}${buildQuery(options.query)}`, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      0,
      controller.signal.aborted
        ? 'The server took too long to respond.'
        : 'Cannot reach the server. Check your Wi-Fi and that the Laravel server is running.',
    );
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  let body: unknown = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      unauthorizedHandler?.();
    }

    const error = (body ?? {}) as ErrorBody;

    throw new ApiError(
      response.status,
      typeof error.message === 'string' ? error.message : `Request failed (${response.status}).`,
      isFieldErrors(error.errors) ? error.errors : {},
    );
  }

  return body as T;
}