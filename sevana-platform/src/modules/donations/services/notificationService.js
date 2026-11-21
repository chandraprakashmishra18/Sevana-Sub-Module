import { apiRequest } from "../api/client";
export async function getNotifications() { const response = await apiRequest("/notifications"); return { items: response.data || [], unreadCount: response.unreadCount || 0 }; }
export async function markNotificationRead(id) { return apiRequest(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH", body: {} }); }
export async function markAllNotificationsRead() { return apiRequest("/notifications/read-all", { method: "PATCH", body: {} }); }
