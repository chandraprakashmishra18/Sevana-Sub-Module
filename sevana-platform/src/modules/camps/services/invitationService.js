import { apiRequest } from "../api/client";
export async function getInvitationsByUser() { const response = await apiRequest("/camps/invitations/mine"); return response.data; }
export async function sendInvitation(data) { const response = await apiRequest(`/camps/${encodeURIComponent(data.campId)}/invitations`, { method: "POST", body: { email: data.toEmail, role: data.role, message: data.message || "" } }); return response.data; }
export async function updateInvitationStatus(id, status) { const value = ({ accepted: "ACCEPTED", declined: "DECLINED", revoked: "REVOKED" }[status] || status.toUpperCase()); const response = await apiRequest(`/camps/invitations/${encodeURIComponent(id)}`, { method: "PATCH", body: { status: value } }); return response.data; }
