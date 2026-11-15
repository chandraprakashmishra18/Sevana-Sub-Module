import mockWorkers, { getTierForXP, getNextTierProgress } from "../data/mockWorkers";
import { getUsers, awardUserXP, recordUserCampJoined, getCurrentUser } from "./authService";
import { awardCommunityXP } from "./communityService";
import { addNotification } from "./notificationService";
import { getCampById } from "./campService";
import { readRegistrations, writeRegistrations, normalizeRegistration, isCancelled } from "../utils/registrationModel";

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
  const camp = await getCampById(joinData.campId);
  if (!camp) return { success: false, error: "This camp could not be found." };
  if (camp.status !== "upcoming") return { success: false, error: "Registrations are closed for this camp." };

  const joins = readRegistrations();
  const email = (joinData.email || "").toLowerCase().trim();
  const existing = joins.find(
    (join) => join.campId === joinData.campId && (join.email || "").toLowerCase() === email
  );

  // Already registered (and not cancelled) -> no duplicate.
  if (existing && !isCancelled(existing)) {
    return { success: true, joinId: existing.id, duplicate: true, xpAwarded: false };
  }

  // Capacity is enforced per role (live count = seeded + saved registrations).
  const slots = joinData.role === "worker" ? camp.workerSlots : camp.attendeeSlots;
  if (slots && slots.filled >= slots.total) {
    return { success: false, error: "This camp is full for the role you selected." };
  }

  // Previously cancelled -> re-activate the same record instead of creating a second one.
  if (existing) {
    existing.status = "REGISTERED";
    existing.attendance = null;
    existing.attended = false;
    writeRegistrations(joins);
    return { success: true, joinId: existing.id, duplicate: false, xpAwarded: false };
  }

  const id = `join${Date.now()}`;
  const xp = joinData.role === "worker" ? 150 : 30;
  joins.unshift({ ...joinData, status: "REGISTERED", attendance: null, attended: false, id, xp, createdAt: new Date().toISOString() });
  writeRegistrations(joins);
  addNotification({ title: "Camp registration confirmed", message: `Your ${joinData.role === "worker" ? "volunteer" : "attendee"} registration for ${joinData.campTitle || "the camp"} is confirmed.`, type: "registration", href: "/my-registrations" });

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

export function getCampRegistrations() {
  return readRegistrations();
}

export function updateCampRegistration(id, updates, { notify = true } = {}) {
  const joins = readRegistrations();
  const item = joins.find((join) => join.id === id);
  if (!item) return null;
  Object.assign(item, updates);
  writeRegistrations(joins);
  if (notify) {
    addNotification({
      title: "Camp registration updated",
      message: `Your registration for ${item.campTitle || "a camp"} is now ${normalizeRegistration(item).status.toLowerCase()}.`,
      type: "registration",
      href: "/my-registrations",
    });
  }
  return item;
}

// ---- Citizen side: "My registrations" ----
export function getMyRegistrations(user) {
  if (!user?.email) return [];
  const email = user.email.toLowerCase();
  return readRegistrations()
    .filter((join) => (join.email || "").toLowerCase() === email)
    .map(normalizeRegistration);
}

export async function cancelMyRegistration(user, id) {
  const reg = readRegistrations().find((join) => join.id === id);
  if (!reg || !user?.email || (reg.email || "").toLowerCase() !== user.email.toLowerCase()) {
    return { success: false, error: "Registration not found." };
  }
  const camp = await getCampById(reg.campId);
  if (camp && (camp.status === "past" || camp.status === "cancelled")) {
    return { success: false, error: "This camp is already over, so the registration can't be cancelled." };
  }
  updateCampRegistration(id, { status: "CANCELLED", attendance: null, attended: false }, { notify: false });
  addNotification({
    title: "Registration cancelled",
    message: `You cancelled your registration for ${reg.campTitle || "the camp"}.`,
    type: "registration",
    href: "/my-registrations",
  });
  return { success: true };
}
