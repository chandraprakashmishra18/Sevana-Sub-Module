import mockCampaigns from "../data/mockCampaigns";
import { getDonationHistory } from "./donationService";

const STORAGE_KEY = "sevana_campaign_overrides";

function readOverrides() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function writeOverrides(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

// Adds donations made in this browser to a campaign's raised amount and donor count
function withLocalDonations(campaign) {
  const donations = getDonationHistory().filter((d) => d.campaignId === campaign.id);
  if (donations.length === 0) return campaign;
  const extra = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  return {
    ...campaign,
    raisedAmount: (Number(campaign.raisedAmount) || 0) + extra,
    donorCount: (Number(campaign.donorCount) || 0) + donations.length,
    localRaised: extra,
    localDonors: donations.length,
  };
}

function mergedCampaigns() {
  const overrides = readOverrides();
  const replaced = new Map(overrides.map((item) => [item.id, item]));
  const list = [
    ...overrides.filter((item) => item.isNew),
    ...mockCampaigns.map((item) => replaced.get(item.id) || item),
  ];
  return list.map(withLocalDonations);
}

// TEAMMATE: replace the body of each function below with a real fetch() call
// to your backend, keeping the same function name and return shape.

export async function getAllCampaigns() {
  return mergedCampaigns();
}

// Same lookup, but instant (no await). Use it inside components that need the campaign right away.
export function findCampaignSync(id) {
  return mergedCampaigns().find((c) => c.id === id) || null;
}

export async function getCampaignById(id) {
  return findCampaignSync(id);
}

export function saveCampaign(campaign) {
  const all = readOverrides();
  const { localRaised = 0, localDonors = 0, ...rest } = campaign;
  const next = {
    ...rest,
    raisedAmount: (Number(rest.raisedAmount) || 0) - localRaised,
    donorCount: (Number(rest.donorCount) || 0) - localDonors,
    updatedAt: new Date().toISOString(),
  };
  const index = all.findIndex((item) => item.id === next.id);
  if (index < 0) all.unshift(next); else all[index] = next;
  writeOverrides(all);
  return next;
}

export function setCampaignModeration(id, status) {
  const campaign = mockCampaigns.find((item) => item.id === id) || readOverrides().find((item) => item.id === id);
  return campaign ? saveCampaign({ ...campaign, status }) : null;
}