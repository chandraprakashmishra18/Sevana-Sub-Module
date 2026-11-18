const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "sevana_access_token";

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function getAccessToken() {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function setAccessToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    throw new Error("This browser could not securely keep the sign-in session for this tab.");
  }
}

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest(path, { method = "GET", body, headers = {}, ...options } = {}) {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      method,
      headers: requestHeaders,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new ApiError("Unable to reach the Sevana API. Check the API URL and try again.");
  }

  if (response.status === 401) unauthorizedHandler?.();
  if (!response.ok) {
    let payload = {};
    try { payload = await response.json(); } catch { /* non-JSON server error */ }
    const validationMessage = Array.isArray(payload.errors)
      ? payload.errors.map((item) => item.path?.length ? `${item.path.join(".")}: ${item.message}` : item.message).filter(Boolean).join(" ")
      : "";
    const message = validationMessage || payload.message || payload.error?.message || `Request failed (${response.status}).`;
    throw new ApiError(message, {
      status: response.status,
      code: payload.error?.code,
      details: payload.errors || payload.error?.details,
    });
  }
  if (response.status === 204) return null;
  try { return await response.json(); } catch {
    throw new ApiError("The Sevana API returned an invalid response.", { status: response.status });
  }
}

export const apiConfigured = Boolean(baseUrl);
