import mockDonors from "../data/mockDonors";
import mockDisbursements from "../data/mockDisbursements";

export async function getDonorsByCampaign(campaignId) {
  return Promise.resolve(mockDonors[campaignId] || []);
}

export async function getDisbursementsByCampaign(campaignId) {
  return Promise.resolve(mockDisbursements[campaignId] || []);
}

// TEAMMATE: this is the real submission point — wire Razorpay + backend here.
export async function submitDonation(donationData) {
  console.log("Donation submitted (mock):", donationData);
  return Promise.resolve({ success: true, receiptId: `SEV-${Date.now().toString().slice(-8)}` });
}