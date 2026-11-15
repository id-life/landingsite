import axios from 'axios';

export type Response<T = any> = {
  code: number;
  message: string;
  data: T;
};

/**
 * What every failed API call rejects with. Before, the interceptor rejected with the response body, which is
 * undefined for network errors and timeouts, so callers could not tell "no such item" from "API down".
 */
export class ApiError extends Error {
  /** HTTP status; undefined when no response arrived (network error, timeout). */
  readonly status?: number;
  /** The API's own `code` from the response body, when it sent one. */
  readonly code?: number;
  readonly url?: string;

  constructor(
    message: string,
    { status, code, url, cause }: { status?: number; code?: number; url?: string; cause?: unknown },
  ) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.url = url;
  }
}

/** The API answered that the item does not exist or the id is malformed (HTTP or body code 400/404). */
export function isApiNotFound(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  return [error.status, error.code].some((value) => value === 400 || value === 404);
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PREFIX,
  timeout: 15_000,
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const response = error?.response;
    const body = response?.data;
    const code = typeof body?.code === 'number' ? body.code : undefined;
    const message = (typeof body?.message === 'string' && body.message) || error?.message || 'API request failed';
    return Promise.reject(new ApiError(message, { status: response?.status, code, url: error?.config?.url, cause: error }));
  },
);

export default instance;
