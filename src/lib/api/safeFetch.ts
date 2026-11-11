/**
 * Safe fetch utility that defensively guards against:
 * 1. Missing backend URL (avoids making relative calls to static Netlify SPA that return index.html)
 * 2. 404 / 500 error responses
 * 3. HTML response bodies causing SyntaxError: Unexpected token '<'
 * 4. Network aborts / timeouts
 */
export async function safeFetchJson<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_CORE_API_URL?.trim();
    if (!baseUrl) {
      // In static export deployment without dedicated backend URL, return null to activate fallback data
      return null;
    }

    const url = endpoint.startsWith('http')
      ? endpoint
      : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    const json = await res.json();
    return json as T;
  } catch {
    return null;
  }
}
