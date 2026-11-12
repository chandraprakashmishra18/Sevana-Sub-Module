const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/** Shared REST boundary. Empty VITE_API_URL keeps this prototype in mock mode. */
export async function apiRequest(path, { method = "GET", body, headers = {}, ...options } = {}) {
  if (!baseUrl) throw new Error("Backend is not configured. This action is available in demo mode only.");
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    method,
    headers: { Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    const error = new Error(`Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}

export const apiConfigured = Boolean(baseUrl);
