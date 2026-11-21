import { apiRequest } from "../api/client";

const get = (path, id) => apiRequest(`${path}/${encodeURIComponent(id)}`);
const post = (path, body) => apiRequest(path, { method: "POST", body });
const patch = (path, body) => apiRequest(path, { method: "PATCH", body });

export const authApi = { login: (data) => post("/auth/login", data), register: (data) => post("/auth/register", data), me: () => apiRequest("/auth/me") };
export const usersApi = { me: () => apiRequest("/users/me"), updateMe: (data) => patch("/users/me", data), activity: () => apiRequest("/users/me/activity"), leaderboard: () => apiRequest("/users/leaderboard"), get: (id) => get("/users", id) };
export const organizationsApi = { list: () => apiRequest("/organizations"), mine: () => apiRequest("/organizations/mine"), create: (data) => post("/organizations", data), get: (id) => get("/organizations", id), update: (id, data) => patch(`/organizations/${encodeURIComponent(id)}`, data) };
export const campsApi = {
  list: (params = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(`/camps${query ? `?${query}` : ""}`); },
  mine: () => apiRequest("/camps/mine"), myRegistrations: () => apiRequest("/camps/registrations/mine"), managerRegistrations: () => apiRequest("/camps/registrations/manage"),
  get: (id) => get("/camps", id), create: (data) => post("/camps", data), update: (id, data) => patch(`/camps/${encodeURIComponent(id)}`, data),
  register: (id, data) => post(`/camps/${encodeURIComponent(id)}/registrations`, data), cancelRegistration: (id) => apiRequest(`/camps/${encodeURIComponent(id)}/registrations/mine`, { method: "DELETE" }),
  updateRegistration: (campId, registrationId, data) => patch(`/camps/${encodeURIComponent(campId)}/registrations/${encodeURIComponent(registrationId)}`, data),
  feedback: (id) => get(`/camps/${encodeURIComponent(id)}`, "feedback"), submitFeedback: (id, data) => post(`/camps/${encodeURIComponent(id)}/feedback`, data),
  invitations: () => apiRequest("/camps/invitations/mine"), sendInvitation: (id, data) => post(`/camps/${encodeURIComponent(id)}/invitations`, data),
  updateInvitation: (id, data) => patch(`/camps/invitations/${encodeURIComponent(id)}`, data),
};
export const notificationsApi = { list: () => apiRequest("/notifications"), read: (id) => patch(`/notifications/${encodeURIComponent(id)}/read`, {}), readAll: () => patch("/notifications/read-all", {}) };
