import mockWorkers, { getTierForXP, getNextTierProgress } from "../data/mockWorkers";
import { getUsers, awardUserXP, recordUserCampJoined, getCurrentUser } from "./authService";
import { awardCommunityXP } from "./communityService";
import { addNotification } from "./notificationService";

const JOIN_KEY = "sevana_camp_joins";

export async function getWorkerById(id) {
  // First check real registered users
  const realUsers = getUsers();
  const realUser = realUsers.find((u) => u.id === id);
  if (realUser) {
    return Promise.resolve({
      id: realUser.id,
      name: realUser.name,
      avatar: realUser.avatar,
      role: realUser.role,
      totalXP: realUser.totalXP || 0,
      badges: realUser.badges || ["New Member"],
      campsWorked: realUser.campsWorked || [],
      campsOrganized: realUser.campsOrganized || [],
    });
  }

  const found = mockWorkers.find((w) => w.id === id);
  return Promise.resolve(found || null);
}

export async function getLeaderboardData() {
  const realUsers = getUsers();
  // Map real registered users
  const realFormatted = realUsers.map((u) => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    role: u.role,
    totalXP: u.totalXP || 0,
    campsWorked: u.campsWorked || [],
    badges: u.badges || ["Community Member"],
  }));

  // Merge with mock workers avoiding duplicates by email or name
  const allWorkers = [...realFormatted];
  for (const mw of mockWorkers) {
    if (!allWorkers.some((w) => w.name.toLowerCase() === mw.name.toLowerCase())) {
      allWorkers.push(mw);
    }
  }

  // Sort descending by XP and assign ranks
  const ranked = allWorkers
    .sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0))
    .map((worker, index) => ({
      ...worker,
      rank: index + 1,
      tier: getTierForXP(worker.totalXP || 0).name,
      tierColor: getTierForXP(worker.totalXP || 0).color,
    }));

  return Promise.resolve(ranked);
}

export function getWorkerTierInfo(xp) {
  return {
    tier: getTierForXP(xp),
    progress: getNextTierProgress(xp),
  };
}

export async function submitJoinCamp(joinData) {
  const joins = JSON.parse(localStorage.getItem(JOIN_KEY) || "[]");
  const email = (joinData.email || "").toLowerCase().trim();
  const duplicate = joins.find(
    (join) => join.campId === joinData.campId && (join.email || "").toLowerCase() === email
  );

  if (duplicate) {
    return { success: true, joinId: duplicate.id, duplicate: true, xpAwarded: false };
  }

  const id = `join${Date.now()}`;
  const xp = joinData.role === "worker" ? 150 : 30;
  joins.unshift({ ...joinData, id, xp, createdAt: new Date().toISOString() });
  localStorage.setItem(JOIN_KEY, JSON.stringify(joins));
  addNotification({ title: "Camp registration received", message: `Your ${joinData.role || "attendee"} registration for ${joinData.campTitle || "the camp"} is pending organizer review.`, type: "registration", href: "/dashboard" });

  // Check if there is an active logged-in user or registered user matching this email
  const realUsers = getUsers();
  const currentUser = getCurrentUser();
  const targetUser =
    (currentUser && currentUser.email.toLowerCase() === email)
      ? currentUser
      : realUsers.find((u) => u.email.toLowerCase() === email);

  if (targetUser) {
    awardUserXP(targetUser.id, xp, `Joined camp as ${joinData.role}`);
    recordUserCampJoined(targetUser.id, {
      campId: joinData.campId,
      role: joinData.skillOrProfession || joinData.role || "Volunteer",
      xpEarned: xp,
      date: new Date().toISOString().split("T")[0],
      title: joinData.campTitle || "Community Camp",
    });
  }

  awardCommunityXP({
    eventId: id,
    kind: "join",
    xp,
    description: `Joined community camp as ${joinData.role}`,
    email: joinData.email,
  });

  return { success: true, joinId: id, xpAwarded: true };
}

export function getCampRegistrations() { try { return JSON.parse(localStorage.getItem(JOIN_KEY) || "[]"); } catch { return []; } }
export function updateCampRegistration(id, updates) {
  const joins = getCampRegistrations(); const item = joins.find((join) => join.id === id); if (!item) return null;
  Object.assign(item, updates); localStorage.setItem(JOIN_KEY, JSON.stringify(joins));
  addNotification({ title: "Camp registration updated", message: `Your registration for ${item.campTitle || "a camp"} is ${item.status || "updated"}.`, type: "registration", href: "/dashboard" });
  return item;
}
