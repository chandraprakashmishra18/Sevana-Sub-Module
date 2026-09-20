// Tier thresholds — used across the app to calculate a worker's current tier from their XP
export const TIER_THRESHOLDS = [
  { name: "Seedling", minXP: 0, color: "var(--tier-seedling)" },
  { name: "Sprout", minXP: 100, color: "var(--tier-sprout)" },
  { name: "Sapling", minXP: 300, color: "var(--tier-sapling)" },
  { name: "Tree", minXP: 700, color: "var(--tier-tree)" },
  { name: "Legend", minXP: 1500, color: "var(--tier-legend)" },
];

const mockWorkers = [
  {
    id: "worker1",
    name: "Rohit Sharma",
    avatar: "https://picsum.photos/seed/rohit-avatar/150/150",
    role: "Volunteer Coordinator",
    totalXP: 820,
    campsWorked: [
      { campId: "camp4", role: "Career Counselor", xpEarned: 120, date: "2026-08-15" },
      { campId: "camp1", role: "Registration Desk", xpEarned: 80, date: "2026-10-05" },
    ],
    badges: ["First Camp", "5 Camps Milestone", "Medical Specialist"],
  },
  {
    id: "worker2",
    name: "Priya Menon",
    avatar: "https://picsum.photos/seed/priya-avatar/150/150",
    role: "Doctor",
    totalXP: 1620,
    campsWorked: [
      { campId: "camp1", role: "Doctor", xpEarned: 200, date: "2026-10-05" },
      { campId: "camp4", role: "Career Counselor", xpEarned: 120, date: "2026-08-15" },
    ],
    badges: ["First Camp", "5 Camps Milestone", "10 Camps Milestone", "Medical Specialist", "Consistency Champion"],
  },
  {
    id: "worker3",
    name: "Aditya Rao",
    avatar: "https://picsum.photos/seed/aditya-avatar/150/150",
    role: "Teacher",
    totalXP: 240,
    campsWorked: [
      { campId: "camp2", role: "Teacher", xpEarned: 150, date: "2026-10-12" },
    ],
    badges: ["First Camp"],
  },
];

// Helper: given a total XP number, returns the worker's current tier object
export function getTierForXP(xp) {
  let current = TIER_THRESHOLDS[0];
  for (const tier of TIER_THRESHOLDS) {
    if (xp >= tier.minXP) {
      current = tier;
    }
  }
  return current;
}

// Helper: returns the next tier (or null if already at max tier) and how much XP is needed to reach it
export function getNextTierProgress(xp) {
  const currentIndex = TIER_THRESHOLDS.findIndex((t) => t.name === getTierForXP(xp).name);
  const nextTier = TIER_THRESHOLDS[currentIndex + 1];

  if (!nextTier) {
    return { nextTier: null, xpNeeded: 0, progressPercent: 100 };
  }

  const currentTierMin = TIER_THRESHOLDS[currentIndex].minXP;
  const xpIntoCurrentTier = xp - currentTierMin;
  const xpRangeForTier = nextTier.minXP - currentTierMin;
  const progressPercent = Math.min(Math.round((xpIntoCurrentTier / xpRangeForTier) * 100), 100);

  return {
    nextTier: nextTier.name,
    xpNeeded: nextTier.minXP - xp,
    progressPercent,
  };
}

export default mockWorkers;