import { getTierForXP, getNextTierProgress } from "../data/mockWorkers";
import { addNotification } from "./notificationService";
import { apiRequest } from "../../../shared/apiClient";
import { getCurrentUser } from "../../donations/services/authService";

export async function getWorkerById(id) {
  const user = getCurrentUser();
  if (!user || user.id !== id) return null;
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    totalXP: user.totalXP || 0,
    badges: user.badges || [],
    campsWorked: user.campsWorked || [],
    campsOrganized: user.campsOrganized || []
  };
}

// The backend does not provide a public leaderboard endpoint yet.
export async function getLeaderboardData() { return []; }

export function getWorkerTierInfo(xp) {
  return { tier: getTierForXP(xp), progress: getNextTierProgress(xp) };
}

export async function submitJoinCamp(joinData) {
  const result = await apiRequest(`/camps/${encodeURIComponent(joinData.campId)}/register`, {
    method: "POST",
    body: {
      fullName: joinData.fullName,
      email: joinData.email || undefined,
      phone: joinData.phone || undefined,
      role: joinData.role === "worker" ? "VOLUNTEER" : "BENEFICIARY"
    }
  });
  addNotification({ title: "Camp registration received", message: result.message, type: "registration", href: "/dashboard" });
  return { success: true, registration: result.data, message: result.message };
}

export async function getCampRegistrationsForCamp(campId) {
  const result = await apiRequest(`/camps/${encodeURIComponent(campId)}/registrations`);
  return result?.data || [];
}

export async function markCampAttendance(campId, registrationId, attendance) {
  const result = await apiRequest(`/camps/${encodeURIComponent(campId)}/registrations/${encodeURIComponent(registrationId)}/attendance`, {
    method: "PATCH", body: { attendance }
  });
  return result.data;
}

export async function updateCampRegistration(id, updates) {
  const result = await apiRequest(`/camps/registrations/${encodeURIComponent(id)}`, { method: "PATCH", body: updates });
  return result.data;
}

export function getCampRegistrations() { return []; }
