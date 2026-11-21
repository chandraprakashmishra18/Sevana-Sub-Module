import { apiRequest } from "../api/client";

export async function getDonorsByCampaign(campaignId) {
  const response = await apiRequest(`/campaigns/${encodeURIComponent(campaignId)}/donations`);
  return response.data || [];
}
export async function getDisbursementsByCampaign(campaignId) {
  const response = await apiRequest(`/campaigns/${encodeURIComponent(campaignId)}/disbursements`);
  return response.data || [];
}
export async function submitDonation(donationData) {
  const amount = Number(donationData.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000) return { success: false, error: "Enter an amount between ₹1 and ₹10,00,000." };
  const response = await apiRequest("/donations/intents", { method: "POST", body: { ...(donationData.campaignId ? { campaignId: donationData.campaignId } : {}), amount, anonymous: Boolean(donationData.anonymous) } });
  return { success: true, donationIntentId: response.data.id, status: response.data.status, paymentStatus: response.data.paymentStatus };
}
export async function getDonationHistory() {
  const response = await apiRequest("/donations/mine");
  return response.data || [];
}
