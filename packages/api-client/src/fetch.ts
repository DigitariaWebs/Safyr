export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;

function isFailureEnvelope(value: unknown): value is ApiFailure {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    v.success === false &&
    typeof v.error === "object" &&
    v.error !== null &&
    typeof (v.error as Record<string, unknown>).code === "string" &&
    typeof (v.error as Record<string, unknown>).message === "string"
  );
}

export function createFetcher(
  baseURL: string,
  getAuthHeader?: () => string | null,
) {
  async function request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.body && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    };
    const authHeader = getAuthHeader?.();
    if (authHeader) headers.Authorization = authHeader;

    // Timeout: build an internal controller only when caller did not supply one.
    const callerSignal = options.signal;
    const internalController = callerSignal ? null : new AbortController();
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    let timedOut = false;
    const timeoutHandle = internalController
      ? setTimeout(() => {
          timedOut = true;
          internalController.abort();
        }, timeoutMs)
      : null;

    let response: Response;
    try {
      response = await fetch(`${baseURL}${path}`, {
        method: options.method ?? "GET",
        headers,
        body: options.body
          ? isFormData
            ? (options.body as FormData)
            : JSON.stringify(options.body)
          : undefined,
        credentials: "include",
        signal: callerSignal ?? internalController?.signal,
      });
    } catch (error) {
      if (timedOut) {
        throw new ApiError(0, "TIMEOUT", "Request timed out");
      }
      // Caller-initiated abort — rethrow untouched.
      if (callerSignal?.aborted) {
        throw error;
      }
      throw new ApiError(0, "NETWORK_ERROR", "Network request failed", {
        cause: error instanceof Error ? error.message : String(error),
      });
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }

    const text = await response.text();

    if (!text) {
      if (response.ok) return undefined as T;
      throw new ApiError(
        response.status,
        "HTTP_ERROR",
        response.statusText || "HTTP error",
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new ApiError(
        response.status,
        "PARSE_ERROR",
        "Invalid JSON response",
      );
    }

    if (isFailureEnvelope(parsed)) {
      throw new ApiError(
        response.status,
        parsed.error.code,
        parsed.error.message,
        parsed.error.details,
      );
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        "HTTP_ERROR",
        response.statusText || "HTTP error",
      );
    }

    const success = parsed as ApiSuccess<T>;
    return success.data;
  }

  return request;
}
