const KEY = "sevana_camps_notifications";
const getItems = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
const saveItems = (items) => localStorage.setItem(KEY, JSON.stringify(items));
export const getNotifications = () => getItems();
export function addNotification({ title, message, type = "update", href = "/dashboard" }) { const item = { id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, message, type, href, createdAt: new Date().toISOString(), read: false }; saveItems([item, ...getItems()]); window.dispatchEvent(new Event("sevana_notifications_changed")); return item; }
export function markNotificationRead(id) { saveItems(getItems().map((item) => item.id === id ? { ...item, read: true } : item)); }
export function markAllNotificationsRead() { saveItems(getItems().map((item) => ({ ...item, read: true }))); }
