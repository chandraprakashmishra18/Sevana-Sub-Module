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
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
    role: "Volunteer Coordinator",
    totalXP: 820,
    campsWorked: [
      { campId: "camp4", role: "Career Counselor", xpEarned: 120, date: "2026-08-15" },
      { campId: "camp1", role: "Registration Desk", xpEarned: 80, date: "2026-10-05" },
      { campId: "camp7", role: "Food Packer", xpEarned: 100, date: "2026-11-15" },
    ],
    badges: ["First Camp", "5 Camps Milestone", "Medical Specialist", "Community Star"],
  },
  {
    id: "worker2",
    name: "Dr. Priya Menon",
    avatar: "https://images.unsplash.com/photo-1594824813627-c10df48db6e5?w=200&auto=format&fit=crop",
    role: "Doctor & Geriatric Specialist",
    totalXP: 1620,
    campsWorked: [
      { campId: "camp1", role: "Doctor", xpEarned: 200, date: "2026-10-05" },
      { campId: "camp6", role: "Doctor", xpEarned: 250, date: "2026-11-08" },
      { campId: "camp8", role: "Paediatrician", xpEarned: 200, date: "2026-10-20" },
      { campId: "camp4", role: "Career Counselor", xpEarned: 120, date: "2026-08-15" },
    ],
    badges: ["First Camp", "5 Camps Milestone", "10 Camps Milestone", "Medical Specialist", "Consistency Champion", "Elder Friend"],
  },
  {
    id: "worker3",
    name: "Aditya Rao",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
    role: "Teacher & Educator",
    totalXP: 580,
    campsWorked: [
      { campId: "camp2", role: "Teacher", xpEarned: 150, date: "2026-10-12" },
      { campId: "camp5", role: "Storyteller", xpEarned: 130, date: "2026-11-02" },
    ],
    badges: ["First Camp", "Orphanage Friend", "Youth Mentor"],
  },
  {
    id: "worker4",
    name: "Dr. Sneha Verma",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop",
    role: "Paediatric Specialist",
    totalXP: 940,
    campsWorked: [
      { campId: "camp8", role: "Paediatrician", xpEarned: 200, date: "2026-10-20" },
      { campId: "camp1", role: "Doctor", xpEarned: 180, date: "2026-10-05" },
    ],
    badges: ["First Camp", "Medical Specialist", "Child Care Champion"],
  },
  {
    id: "worker5",
    name: "Vikram Malhotra",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
    role: "Old Age Home Support Lead",
    totalXP: 450,
    campsWorked: [
      { campId: "camp6", role: "Volunteer Helper", xpEarned: 150, date: "2026-11-08" },
    ],
    badges: ["First Camp", "Elder Companion"],
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
