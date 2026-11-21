// In development, use Vite's same-origin /api proxy so LAN browser visits do
// not try to reach localhost from the visitor's device or require CORS.
const configuredApiUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "")
  : "";
const baseUrl = configuredApiUrl
  ? (configuredApiUrl.endsWith("/api") ? configuredApiUrl : `${configuredApiUrl}/api`)
  : "/api";
const TOKEN_KEY = "sevana_access_token";
const USER_KEY = "sevana_backend_user";
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) { unauthorizedHandler = handler; }
export function getAccessToken() {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp * 1000 <= Date.now()) { setAccessToken(null); return null; }
    return token;
  } catch { return null; }
}
export function setAccessToken(token) {
  if (!token) {
    try { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(USER_KEY); } catch { /* storage unavailable */ }
    return;
  }
  try { sessionStorage.setItem(TOKEN_KEY, token); } catch { throw new Error("Unable to store the sign-in session in this browser."); }
}
export function getCachedBackendUser() {
  try { return JSON.parse(sessionStorage.getItem(USER_KEY) || "null"); } catch { return null; }
}
export function setCachedBackendUser(user) {
  try { if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user)); else sessionStorage.removeItem(USER_KEY); } catch { /* token remains authoritative */ }
}

export class ApiError extends Error {
  constructor(message, { status, details } = {}) { super(message); this.name = "ApiError"; this.status = status; this.details = details; }
}

export async function apiRequest(path, { method = "GET", body, headers = {}, ...options } = {}) {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined && !(body instanceof FormData)) requestHeaders.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  let response;
  try {
    response = await fetch(`${baseUrl}${path.startsWith("/") ? path : `/${path}`}`, {
      ...options, method, headers: requestHeaders,
      ...(body !== undefined ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}),
    });
  } catch { throw new ApiError("Unable to reach the Sevana API. Please try again."); }
  if (response.status === 401) unauthorizedHandler?.();
  if (!response.ok) {
    let payload = {}; try { payload = await response.json(); } catch { /* non-JSON response */ }
    const message = Array.isArray(payload.errors)
      ? payload.errors.map((item) => item.path?.length ? `${item.path.join(".")}: ${item.message}` : item.message).filter(Boolean).join(" ")
      : payload.message || `Request failed (${response.status}).`;
    throw new ApiError(message, { status: response.status, details: payload.errors });
  }
  if (response.status === 204) return null;
  try { return await response.json(); } catch { throw new ApiError("The API returned an invalid response.", { status: response.status }); }
}
export const apiConfigured = true;
