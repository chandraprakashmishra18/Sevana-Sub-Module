import { apiRequest } from "../api/client";

const CATEGORY_FROM_DB = { STUDENT_SPONSORSHIP: "Student Sponsorship", MEDICAL_AID: "Medical Aid", FOOD_SUPPORT: "Family Aid", CLOTHING_SUPPORT: "In-Kind Giving", EMERGENCY_RELIEF: "Family Aid", EDUCATION: "Student Sponsorship", HEALTH: "Medical Aid", OTHER: "Family Aid" };
const CATEGORY_TO_DB = { "Student Sponsorship": "STUDENT_SPONSORSHIP", "Family Aid": "OTHER", "In-Kind Giving": "OTHER", "Medical Aid": "MEDICAL_AID" };
const BENEFICIARY_FROM_DB = { GENERAL: "General", CHILDREN: "Orphanage", ELDERLY: "Old Age Home", WOMEN: "General", PERSONS_WITH_DISABILITIES: "General", STUDENTS: "General", FAMILIES: "General" };
const BENEFICIARY_TO_DB = { General: "GENERAL", Orphanage: "CHILDREN", "Old Age Home": "ELDERLY", NGO: "GENERAL" };
const cache = new Map();
function toView(row) {
  const item = { ...row, category: CATEGORY_FROM_DB[row.category] || row.category, targetBeneficiary: row.targetBeneficiary || BENEFICIARY_FROM_DB[row.beneficiaryGroup] || "General", ngo: row.ngo || row.organizationName || row.organization?.name || "Organization", ngoVerified: row.ngoVerified ?? row.organizationStatus === "VERIFIED", goalAmount: row.goalAmount == null ? null : Number(row.goalAmount), raisedAmount: Number(row.raisedAmount || 0), donorCount: Number(row.donorCount || 0), deadline: row.deadline || row.endDate?.slice?.(0, 10) || "", image: row.image || row.imageUrl || "", location: row.location || "", status: String(row.status || "DRAFT").toLowerCase() };
  if (item.id) cache.set(item.id, item);
  return item;
}
function toPayload(campaign) {
  const status = campaign.status ? ({ draft: "DRAFT", active: "ACTIVE", paused: "PAUSED", completed: "COMPLETED", cancelled: "CANCELLED" }[campaign.status] || campaign.status.toUpperCase()) : undefined;
  return {
    ...(campaign.title !== undefined ? { title: campaign.title } : {}),
    ...(campaign.description !== undefined ? { description: campaign.description } : {}),
    ...(campaign.category !== undefined ? { category: CATEGORY_TO_DB[campaign.category] || "OTHER" } : {}),
    ...(campaign.targetBeneficiary !== undefined ? { beneficiaryGroup: BENEFICIARY_TO_DB[campaign.targetBeneficiary] || "GENERAL" } : {}),
    ...(campaign.goalAmount !== undefined && campaign.goalAmount !== "" ? { goalAmount: Number(campaign.goalAmount) } : {}),
    ...(campaign.image !== undefined ? { imageUrl: campaign.image || undefined } : {}),
    ...(campaign.location !== undefined ? { location: campaign.location } : {}),
    ...(campaign.startDate || campaign.deadline ? { startDate: campaign.startDate || new Date().toISOString() } : {}),
    ...(campaign.endDate || campaign.deadline ? { endDate: campaign.endDate || `${campaign.deadline}T23:59:59.000Z` } : {}),
    ...(status ? { status } : {}),
  };
}
async function saveView(response) { return toView(response.data); }
export async function getAllCampaigns() { const response = await apiRequest("/campaigns"); return (response.data || []).map(toView); }
export async function getOrganizationCampaigns() { const response = await apiRequest("/campaigns/mine"); return (response.data || []).map(toView); }
export async function getCampaignById(id) { const response = await apiRequest(`/campaigns/${encodeURIComponent(id)}`); return response.data ? toView(response.data) : null; }
export function findCampaignSync(id) { return cache.get(id) || null; }
export async function saveCampaign(campaign) {
  if (campaign.id) return saveView(await apiRequest(`/campaigns/${encodeURIComponent(campaign.id)}`, { method: "PATCH", body: toPayload(campaign) }));
  return saveView(await apiRequest("/campaigns", { method: "POST", body: toPayload(campaign) }));
}
export async function setCampaignModeration() { throw new Error("Campaign moderation is not available to this account."); }
export function clearCampaignCache() { cache.clear(); }
