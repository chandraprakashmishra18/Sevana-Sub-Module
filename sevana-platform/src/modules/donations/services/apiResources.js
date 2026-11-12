import { apiRequest } from "../api/client";

// Typed resource boundary for the planned REST API. Existing UI remains on the
// persisted demo services until a backend URL is explicitly configured.
const resource = (path) => ({
  list: (params = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(`${path}${query ? `?${query}` : ""}`); },
  get: (id) => apiRequest(`${path}/${encodeURIComponent(id)}`),
  create: (data) => apiRequest(path, { method: "POST", body: data }),
  update: (id, data) => apiRequest(`${path}/${encodeURIComponent(id)}`, { method: "PATCH", body: data }),
  remove: (id) => apiRequest(`${path}/${encodeURIComponent(id)}`, { method: "DELETE" }),
});

export const authApi = { login: (credentials) => apiRequest("/auth/login", { method: "POST", body: credentials }), register: (data) => apiRequest("/auth/register", { method: "POST", body: data }) };
export const usersApi = resource("/users");
export const organizationsApi = resource("/organizations");
export const donationsApi = resource("/donations");
export const campaignsApi = resource("/campaigns");
export const campsApi = resource("/camps");
export const volunteersApi = resource("/volunteers");
export const beneficiariesApi = resource("/beneficiaries");
export const notificationsApi = resource("/notifications");
