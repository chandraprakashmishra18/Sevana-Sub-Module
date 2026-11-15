const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const TOKEN_STORAGE_KEY = "sevana_access_token";
export const apiConfigured = Boolean(baseUrl);

export async function apiRequest(
  path,
  { method = "GET", body, headers = {}, ...options } = {}
) {
  if (!baseUrl) {
    throw new Error("Backend URL is not configured.");
  }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const response = await fetch(`${baseUrl}${path}`, {
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
    const error = new Error(
      result?.message || `Request failed (${response.status})`
    );
    error.status = response.status;
    error.details = result?.errors;
    throw error;
  }

  return result;
}
