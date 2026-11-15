import { apiRequest } from "../../../shared/apiClient";

const categoryLabels = {
  STUDENT_SPONSORSHIP: "Student Sponsorship",
  MEDICAL_AID: "Medical Aid",
  FOOD_SUPPORT: "Food Support",
  CLOTHING_SUPPORT: "Clothing Support",
  EMERGENCY_RELIEF: "Emergency Relief",
  EDUCATION: "Education",
  HEALTH: "Health",
  OTHER: "Other"
};
const categoryValues = Object.fromEntries(Object.entries(categoryLabels).map(([key, label]) => [label, key]));
const beneficiaryLabels = { GENERAL: "General", CHILDREN: "Orphanage", WOMEN: "Women", ELDERLY: "Old Age Home", PERSONS_WITH_DISABILITIES: "Persons with disabilities", STUDENTS: "Students", FAMILIES: "Families" };

function normalizeCampaign(campaign) {
  return {
    ...campaign,
    ngo: campaign.organization?.name || campaign.ngo || "Sevana organization",
    ngoId: campaign.organizationId || campaign.organization?.id,
    goalAmount: Number(campaign.goalAmount || 0),
    // The API currently exposes successful donation counts, not a summed amount.
    raisedAmount: 0,
    donorCount: campaign._count?.donations || 0,
    status: campaign.status?.toLowerCase() || "draft",
    location: campaign.location || [campaign.city, campaign.state].filter(Boolean).join(", "),
    description: campaign.description || "",
    image: campaign.imageUrl || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop",
    category: categoryLabels[campaign.category] || campaign.category || "Other community needs",
    targetBeneficiary: beneficiaryLabels[campaign.beneficiaryGroup] || campaign.beneficiaryGroup || "General"
  };
}

export async function getAllCampaigns({ organizationId } = {}) {
  const path = organizationId
    ? `/campaigns/mine?organizationId=${encodeURIComponent(organizationId)}`
    : "/campaigns";
  const result = await apiRequest(path);
  return (result?.data || []).map(normalizeCampaign);
}

export async function getCampaignById(id) {
  const result = await apiRequest(`/campaigns/${encodeURIComponent(id)}`);
  return result?.data ? normalizeCampaign(result.data) : null;
}

export async function createCampaign({ organizationId, ...campaign }) {
  const result = await apiRequest("/campaigns", {
    method: "POST",
    body: {
      organizationId,
      title: campaign.title,
      description: campaign.description,
      category: categoryValues[campaign.category] || campaign.category || "OTHER",
      ...(campaign.goalAmount ? { goalAmount: Number(campaign.goalAmount) } : {}),
      currency: "INR",
      location: campaign.location,
      ...(campaign.deadline ? { endDate: new Date(campaign.deadline).toISOString() } : {})
    }
  });
  return normalizeCampaign(result.data);
}

export async function updateCampaign(id, updates) {
  const result = await apiRequest(`/campaigns/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: {
      ...(updates.title !== undefined ? { title: updates.title } : {}),
      ...(updates.description !== undefined ? { description: updates.description } : {}),
      ...(updates.category !== undefined ? { category: categoryValues[updates.category] || updates.category } : {}),
      ...(updates.goalAmount !== undefined && updates.goalAmount !== "" ? { goalAmount: Number(updates.goalAmount) } : {}),
      ...(updates.location !== undefined ? { location: updates.location } : {}),
      ...(updates.deadline ? { endDate: new Date(updates.deadline).toISOString() } : {})
    }
  });
  return normalizeCampaign(result.data);
}

export async function updateCampaignStatus(id, status) {
  const result = await apiRequest(`/campaigns/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { status: status.toUpperCase() }
  });
  return normalizeCampaign(result.data);
}

// Kept for old imports; writes are intentionally disabled instead of pretending to persist.
export function saveCampaign() {
  throw new Error("Use createCampaign or updateCampaign to save campaigns to Sevana.");
}

export function setCampaignModeration() {
  throw new Error("Campaign moderation is not available through the current backend API.");
}
