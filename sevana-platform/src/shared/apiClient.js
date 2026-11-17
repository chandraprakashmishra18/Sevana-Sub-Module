const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const TOKEN_STORAGE_KEY = "sevana_access_token";
export const apiConfigured = Boolean(baseUrl);
const inFlightGetRequests = new Map();

export async function apiRequest(
  path,
  { method = "GET", body, headers = {}, ...options } = {}
) {
  if (!baseUrl) {
    throw new Error("Backend URL is not configured.");
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const requestUrl = `${baseUrl}${path}`;
  const requestKey = method.toUpperCase() === "GET" && !options.signal
    ? `${token || "guest"}:${requestUrl}`
    : null;
  if (requestKey && inFlightGetRequests.has(requestKey)) {
    return inFlightGetRequests.get(requestKey);
  }

  const request = (async () => {
    const response = await fetch(requestUrl, {
      ...options,
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    });

    const result = response.status === 204
      ? null
      : await response.json().catch(() => null);

    if (!response.ok) {
      const detailMessages = [
        ...(result?.errors?.formErrors || []),
        ...Object.values(result?.errors?.fieldErrors || {}).flat()
      ];
      const backendMessage = result?.message || result?.error || `Request failed (${response.status})`;
      const error = new Error([
        `${backendMessage} [${method.toUpperCase()} ${path}, HTTP ${response.status}]`,
        ...detailMessages
      ].filter(Boolean).join(" "));
      error.status = response.status;
      error.details = result?.errors;
      throw error;
    }

    return result;
  })();

  if (requestKey) inFlightGetRequests.set(requestKey, request);
  try {
    return await request;
  } finally {
    if (requestKey && inFlightGetRequests.get(requestKey) === request) {
      inFlightGetRequests.delete(requestKey);
    }
  }
}
