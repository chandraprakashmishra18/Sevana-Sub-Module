import mockWorkers, { getTierForXP, getNextTierProgress } from "../data/mockWorkers";
import { getLeaderboard } from "../data/mockLeaderboard";
import { awardCommunityXP } from "./communityService";

const JOIN_KEY = "sevana_camp_joins";

export async function getWorkerById(id) {
  const found = mockWorkers.find((w) => w.id === id);
  return Promise.resolve(found || null);
}

export async function getLeaderboardData() {
  return Promise.resolve(getLeaderboard());
}

export function getWorkerTierInfo(xp) {
  return {
    tier: getTierForXP(xp),
    progress: getNextTierProgress(xp),
  };
}

// TEAMMATE: this handles both Worker and Attendee joins — the `role` field
// in joinData tells you which. Wire this to a real POST /camps/:id/join later.
export async function submitJoinCamp(joinData) {
  const joins = JSON.parse(localStorage.getItem(JOIN_KEY) || "[]");
  const duplicate = joins.find((join) => join.campId === joinData.campId && join.email.toLowerCase() === joinData.email.toLowerCase());
  if (duplicate) return { success: true, joinId: duplicate.id, duplicate: true, xpAwarded: false };
  const id = `join${Date.now()}`;
  const xp = joinData.role === "worker" ? 150 : 30;
  joins.unshift({ ...joinData, id, xp, createdAt: new Date().toISOString() });
  localStorage.setItem(JOIN_KEY, JSON.stringify(joins));
  const xpAwarded = awardCommunityXP({ eventId: id, kind: "join", xp, description: `Joined community camp as ${joinData.role}`, email: joinData.email });
  return { success: true, joinId: id, xpAwarded };
}
