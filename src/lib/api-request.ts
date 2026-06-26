import { ApiResponse, ApiResponseError } from '@/types/api.schema';
import { env } from './env';

const AUTH_PATHS_WITHOUT_REFRESH = new Set(['auth/login', 'auth/refresh']);

export const apiRequest = async <T>({
  url,
  path,
  method,
  body,
  headers,
  credentials = 'include',
  query,
}: {
  url?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, unknown>;
  headers?: HeadersInit | 'none' | undefined;
  credentials?: RequestCredentials;
  query?: Record<string, string | number | boolean | undefined | Date | null>;
}): Promise<ApiResponse<T>> => {
  if (!url) {
    url = `${env.BACKEND_URL}/${path}`;
  } else {
    url = `${url}/${path}`;
  }

  if (query) {
    const qs = Object.entries(query)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      )
      .join('&');
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }
  const headersTratado =
    headers === 'none'
      ? undefined
      : headers
        ? headers
        : {
            'Content-Type': 'application/json',
          };
  const executeRequest = () =>
    fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: headersTratado,
      credentials: credentials,
    });

  let response = await executeRequest();

  const shouldTryRefresh =
    !AUTH_PATHS_WITHOUT_REFRESH.has(path) &&
    response.status === 401 &&
    url.startsWith(env.BACKEND_URL);

  if (shouldTryRefresh) {
    const responseRefresh = await fetch(`${env.BACKEND_URL}/auth/refresh`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (responseRefresh.status === 200) {
      response = await executeRequest();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (response.status >= 400 && method === 'GET') {
    throw data as ApiResponseError;
  }

  return { data, status: response.status };
};
