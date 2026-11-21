import { getMyActivity } from "../../donations/services/userService";

export async function awardCommunityXP() {
  throw new Error("XP can only be awarded by the backend after verified events.");
}

export async function getCommunityActivity() {
  const activity = await getMyActivity();
  return { totalXP: activity.reduce((total, event) => total + Number(event.amount || 0), 0), activity };
}
