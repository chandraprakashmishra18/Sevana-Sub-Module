import mockCampaigns from "../data/mockCampaigns";
const STORAGE_KEY = "sevana_campaign_overrides";

function readOverrides() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function writeOverrides(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

// TEAMMATE: replace the body of each function below with a real fetch() call
// to your backend, keeping the same function name and return shape.
// Example real version:
// export async function getAllCampaigns() {
//   const res = await fetch(`${import.meta.env.VITE_API_URL}/campaigns`);
//   return res.json();
// }

export async function getAllCampaigns() {
  const overrides = readOverrides();
  const replaced = new Map(overrides.map((item) => [item.id, item]));
  return [...overrides.filter((item) => item.isNew), ...mockCampaigns.map((item) => replaced.get(item.id) || item)];
}

export async function getCampaignById(id) {
  const found = (await getAllCampaigns()).find((c) => c.id === id);
  return Promise.resolve(found || null);
}

export function saveCampaign(campaign) {
  const all = readOverrides();
  const next = { ...campaign, updatedAt: new Date().toISOString() };
  const index = all.findIndex((item) => item.id === next.id);
  if (index < 0) all.unshift(next); else all[index] = next;
  writeOverrides(all);
  return next;
}

export function setCampaignModeration(id, status) {
  const campaign = mockCampaigns.find((item) => item.id === id) || readOverrides().find((item) => item.id === id);
  return campaign ? saveCampaign({ ...campaign, status }) : null;
}
