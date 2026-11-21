import { apiRequest } from "../api/client";

const list = (path, params = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(`${path}${query ? `?${query}` : ""}`); };
const get = (path, id) => apiRequest(`${path}/${encodeURIComponent(id)}`);
const create = (path, body) => apiRequest(path, { method: "POST", body });
const update = (path, id, body) => apiRequest(`${path}/${encodeURIComponent(id)}`, { method: "PATCH", body });

export const authApi = {
  login: (credentials) => create("/auth/login", credentials),
  register: (data) => create("/auth/register", data),
  me: () => apiRequest("/auth/me"),
};
export const usersApi = { me: () => apiRequest("/users/me"), updateMe: (data) => apiRequest("/users/me", { method: "PATCH", body: data }), activity: () => apiRequest("/users/me/activity"), leaderboard: () => apiRequest("/users/leaderboard"), get: (id) => get("/users", id) };
export const organizationsApi = { list: () => list("/organizations"), mine: () => list("/organizations/mine"), create: (data) => create("/organizations", data), get: (id) => get("/organizations", id), update: (id, data) => update("/organizations", id, data), campaigns: (id) => apiRequest(`/organizations/${encodeURIComponent(id)}/campaigns`), donations: (id) => apiRequest(`/organizations/${encodeURIComponent(id)}/donations`) };
export const campaignsApi = { list: (params) => list("/campaigns", params), mine: () => list("/campaigns/mine"), get: (id) => get("/campaigns", id), create: (data) => create("/campaigns", data), update: (id, data) => update("/campaigns", id, data), donations: (id) => apiRequest(`/campaigns/${encodeURIComponent(id)}/donations`), disbursements: (id) => apiRequest(`/campaigns/${encodeURIComponent(id)}/disbursements`) };
export const donationsApi = { mine: () => list("/donations/mine"), createIntent: (data) => create("/donations/intents", data) };
export const notificationsApi = { list: () => list("/notifications"), read: (id) => apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH", body: {} }), readAll: () => apiRequest("/notifications/read-all", { method: "PATCH", body: {} }) };
