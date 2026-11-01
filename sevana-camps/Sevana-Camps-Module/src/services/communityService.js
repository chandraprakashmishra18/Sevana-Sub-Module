const ACTIVITY_KEY = "sevana_community_activity";

function readActivity() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function awardCommunityXP({ eventId, kind, xp, description, email }) {
  const activity = readActivity();
  if (activity.some((item) => item.eventId === eventId)) return false;
  activity.unshift({
    eventId,
    kind,
    xp,
    description,
    email: (email || "volunteer@example.com").trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  });
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
  } catch {
    return false;
  }
  return true;
}

export function getCommunityActivity(email = "volunteer@example.com") {
  const normalized = email.trim().toLowerCase();
  const activity = readActivity().filter((item) => item.email === normalized);
  return {
    totalXP: activity.reduce((total, item) => total + item.xp, 0),
    activity,
  };
}
