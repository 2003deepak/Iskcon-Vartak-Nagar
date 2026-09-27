/**
 * adminFetch: Client-side fetch wrapper with automatic JWT token refresh on 401
 * 
 * Flow:
 * 1. Executes the API request with browser cookies.
 * 2. If the API returns 401 Unauthorized (Access token expired):
 *    - Automatically sends a POST to /api/admin/auth/refresh using the Refresh Token cookie.
 *    - Queues concurrent 401 requests to wait on the same refresh call (avoiding rotation race conditions).
 *    - Once the new Access & Refresh tokens are issued into HttpOnly cookies, retries the original request.
 * 3. If the refresh token has expired or is invalid, redirects to /admin/login cleanly.
 */

let refreshPromise: Promise<boolean> | null = null;

export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const urlStr =
    typeof input === "string"
      ? input
      : input instanceof URL
      ? input.toString()
      : (input as Request).url;

  const isAuthEndpoint =
    urlStr.includes("/api/admin/auth/login") ||
    urlStr.includes("/api/admin/auth/refresh") ||
    urlStr.includes("/api/admin/auth/logout");

  // 1. Initial request
  let response = await fetch(input, init);

  // 2. If 401 Unauthorized on non-auth endpoint, attempt token refresh & retry
  if (response.status === 401 && !isAuthEndpoint) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshRes = await fetch("/api/admin/auth/refresh", {
            method: "POST",
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            return Boolean(data.success);
          }
          return false;
        } catch {
          return false;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    const refreshSuccess = await refreshPromise;

    if (refreshSuccess) {
      // 3. Retry original request with freshly renewed access token cookie
      response = await fetch(input, init);
    } else {
      // Refresh token expired or revoked -> redirect to login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/admin/login")) {
          window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
  }

  return response;
}
