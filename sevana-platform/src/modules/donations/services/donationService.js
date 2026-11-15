import { apiRequest } from "../../../shared/apiClient";

export async function getDonorsByCampaign() {
  // Public campaign responses intentionally expose aggregates, not donor identities.
  return [];
}

export async function getDisbursementsByCampaign() {
  // Distributions are organization-scoped and are not exposed on public campaign pages.
  return [];
}

export async function submitDonation(donationData) {
  const result = await apiRequest("/donations", {
    method: "POST",
    body: {
      campaignId: donationData.campaignId || undefined,
      donorName: donationData.anonymous ? "Anonymous" : donationData.donorName,
      donorEmail: donationData.donorEmail || undefined,
      type: "MONEY",
      amount: Number(donationData.amount),
      currency: "INR",
      isAnonymous: Boolean(donationData.anonymous)
    }
  });
  return { success: true, donation: result.data, status: result.data.status };
}

export async function getDonationHistory({ organizationId } = {}) {
  const query = organizationId
    ? `?organizationId=${encodeURIComponent(organizationId)}`
    : "?mine=true";
  const result = await apiRequest(`/donations${query}`);
  return result?.data || [];
}
