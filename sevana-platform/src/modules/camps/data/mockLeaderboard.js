import mockWorkers, { getTierForXP } from "./mockWorkers";

// Returns workers sorted by XP descending, with rank and tier attached — used for the Leaderboard page
export function getLeaderboard() {
  return [...mockWorkers]
    .sort((a, b) => b.totalXP - a.totalXP)
    .map((worker, index) => ({
      ...worker,
      rank: index + 1,
      tier: getTierForXP(worker.totalXP).name,
      tierColor: getTierForXP(worker.totalXP).color,
    }));
}