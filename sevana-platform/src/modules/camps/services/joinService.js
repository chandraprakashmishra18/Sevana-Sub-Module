import { apiRequest } from "../api/client";
import { getMyProfile, getPublicProfile, getLeaderboard } from "../../donations/services/userService";

export async function submitJoinCamp(joinData) {
  const role = joinData.role === "worker" ? "VOLUNTEER" : "BENEFICIARY";
  const response = await apiRequest(`/camps/${encodeURIComponent(joinData.campId)}/registrations`, { method: "POST", body: { role, notes: [joinData.skillOrProfession, joinData.reasonForVisit, joinData.ageGroup].filter(Boolean).join(" · ") } });
  return { success: true, registration: response.data, duplicate: false };
}
export async function getCampRegistrations() {
  const response = await apiRequest("/camps/registrations/manage");
  return (response.data || []).map((registration) => ({ ...registration, role: registration.role === "VOLUNTEER" ? "worker" : "attendee", status: registration.status.toLowerCase(), attended: registration.attendance === "PRESENT" }));
}
export async function getMyCampRegistrations() {
  const response = await apiRequest("/camps/registrations/mine");
  return (response.data || []).map((item) => ({ ...item, campId: item.campId, campTitle: item.camp.title, role: item.role === "VOLUNTEER" ? "worker" : "attendee", status: item.status.toLowerCase(), attended: item.attendance === "PRESENT" }));
}
export async function cancelMyCampRegistration(campId) { return apiRequest(`/camps/${encodeURIComponent(campId)}/registrations/mine`, { method: "DELETE" }); }
export async function updateCampRegistration(registration, updates) {
  const body = {};
  if (updates.status) body.status = ({ approved: "REGISTERED", rejected: "CANCELLED", pending: "REGISTERED" }[updates.status] || updates.status.toUpperCase());
  if (updates.attended !== undefined) body.attendance = updates.attended ? "PRESENT" : "ABSENT";
  const response = await apiRequest(`/camps/${encodeURIComponent(registration.campId)}/registrations/${encodeURIComponent(registration.id)}`, { method: "PATCH", body });
  return response.data;
}
export async function getWorkerById(id) {
  const row = id ? await getPublicProfile(id) : await getMyProfile();
  return row ? { ...row, name: row.name || row.fullName, avatar: row.avatar || "", role: row.role || (row.memberships?.[0]?.organization?.name ? "Organization member" : "Community member"), campsWorked: row.campsWorked || row.campsJoined || [], campsOrganized: row.campsOrganized || [] } : null;
}
export async function getLeaderboardData() { return getLeaderboard(); }
export { getTierForXP, getNextTierProgress } from "./tierService";
