export const DONATION_XP_RULES = [
  { minAmount: 100, xp: 10 },
  { minAmount: 500, xp: 50 },
  { minAmount: 1000, xp: 120 },
  { minAmount: 5000, xp: 700 },
];

/**
 * Returns the XP earned for a given donation amount.
 * Uses the highest applicable tier.
 */
export function getXPForDonation(amount) {
  let earned = 0;
  for (const rule of DONATION_XP_RULES) {
    if (amount >= rule.minAmount) {
      earned = rule.xp;
    }
  }
  return earned;
}

export const DONOR_TIER_THRESHOLDS = [
  { name: "Seedling", minXP: 0, color: "var(--tier-seedling)" },
  { name: "Sprout", minXP: 100, color: "var(--tier-sprout)" },
  { name: "Sapling", minXP: 300, color: "var(--tier-sapling)" },
  { name: "Tree", minXP: 700, color: "var(--tier-tree)" },
  { name: "Legend", minXP: 1500, color: "var(--tier-legend)" },
];

export function getTierForDonorXP(xp) {
  let current = DONOR_TIER_THRESHOLDS[0];
  for (const tier of DONOR_TIER_THRESHOLDS) {
    if (xp >= tier.minXP) {
      current = tier;
    }
  }
  return current;
}

export function getNextDonorTierProgress(xp) {
  const currentIndex = DONOR_TIER_THRESHOLDS.findIndex(
    (t) => t.name === getTierForDonorXP(xp).name
  );
  const nextTier = DONOR_TIER_THRESHOLDS[currentIndex + 1];

  if (!nextTier) {
    return { nextTier: null, xpNeeded: 0, progressPercent: 100 };
  }

  const currentTierMin = DONOR_TIER_THRESHOLDS[currentIndex].minXP;
  const xpIntoCurrentTier = xp - currentTierMin;
  const xpRangeForTier = nextTier.minXP - currentTierMin;
  const progressPercent = Math.min(
    Math.round((xpIntoCurrentTier / xpRangeForTier) * 100),
    100
  );

  return {
    nextTier: nextTier.name,
    xpNeeded: nextTier.minXP - xp,
    progressPercent,
  };
}

const mockDonorXPProfiles = [
  {
    id: "donor1",
    name: "Dr. Priya Menon",
    avatar: "https://images.unsplash.com/photo-1594824813627-c10df48db6e5?w=200&auto=format&fit=crop",
    totalXP: 1450,
    donationCount: 8,
    totalDonated: 12500,
    rank: 1,
  },
  {
    id: "donor2",
    name: "Rohit Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
    totalXP: 950,
    donationCount: 5,
    totalDonated: 8500,
    rank: 2,
  },
  {
    id: "donor3",
    name: "Sneha Kapoor",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop",
    totalXP: 720,
    donationCount: 4,
    totalDonated: 6500,
    rank: 3,
  },
  {
    id: "donor4",
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
    totalXP: 630,
    donationCount: 6,
    totalDonated: 6000,
    rank: 4,
  },
  {
    id: "donor5",
    name: "Ananya Gupta",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop",
    totalXP: 450,
    donationCount: 3,
    totalDonated: 3500,
    rank: 5,
  },
];

export default mockDonorXPProfiles;
