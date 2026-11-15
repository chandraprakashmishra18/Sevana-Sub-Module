export const MIN_DONATION = 1;
export const MAX_DONATION = 100000;

const HIDDEN_STATUSES = ["draft", "rejected", "paused"];

export function isCampaignPublic(campaign) {
  return Boolean(campaign) && !HIDDEN_STATUSES.includes(campaign.status);
}

export function isGoalReached(campaign) {
  if (!campaign) return false;
  const goal = Number(campaign.goalAmount) || 0;
  return goal > 0 && (Number(campaign.raisedAmount) || 0) >= goal;
}

// "" = donations allowed. Otherwise: "not-found" | "unavailable" | "goal-reached"
export function getDonationBlockReason(campaign) {
  if (!campaign) return "not-found";
  if (!isCampaignPublic(campaign)) return "unavailable";
  if (isGoalReached(campaign)) return "goal-reached";
  return "";
}

export function getDaysLeft(deadline) {
  if (!deadline) return null;
  const end = new Date(`${deadline}T23:59:59`);
  if (Number.isNaN(end.getTime())) return null;
  return Math.ceil((end.getTime() - Date.now()) / 86400000);
}