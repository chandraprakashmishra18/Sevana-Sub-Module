import mockWorkers, { getTierForXP, getNextTierProgress } from "../data/mockWorkers";
import { getLeaderboard } from "../data/mockLeaderboard";

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
  console.log("Camp join submitted (mock):", joinData);
  return Promise.resolve({ success: true, joinId: `join${Date.now()}` });
}