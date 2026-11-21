import { apiRequest } from "../api/client";
export async function getFeedbackByCamp(campId) { const response = await apiRequest(`/camps/${encodeURIComponent(campId)}/feedback`); return response.data || []; }
export async function submitFeedback(campId, data) { const response = await apiRequest(`/camps/${encodeURIComponent(campId)}/feedback`, { method: "POST", body: data }); return response.data; }
