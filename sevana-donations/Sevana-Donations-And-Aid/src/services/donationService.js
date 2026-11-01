import mockDonors from "../data/mockDonors";
import mockDisbursements from "../data/mockDisbursements";
import { getXPForDonation } from "../data/mockDonorXP";

const DONATION_KEY = "sevana_donation_history";

export async function getDonorsByCampaign(campaignId) {
  return Promise.resolve(mockDonors[campaignId] || []);
}

export async function getDisbursementsByCampaign(campaignId) {
  return Promise.resolve(mockDisbursements[campaignId] || []);
}

// TEAMMATE: this is the real submission point — wire Razorpay + backend here.
export async function submitDonation(donationData) {
  const receiptId = `SEV-${Date.now().toString().slice(-8)}`;
  const donation = {
    ...donationData,
    receiptId,
    xp: getXPForDonation(Number(donationData.amount) || 0),
    createdAt: new Date().toISOString(),
  };
  try {
    const history = JSON.parse(localStorage.getItem(DONATION_KEY) || "[]");
    history.unshift(donation);
    localStorage.setItem(DONATION_KEY, JSON.stringify(history));
    return { success: true, receiptId, xp: donation.xp };
  } catch {
    return { success: false, error: "Could not save donation receipt in this browser." };
  }
}

export function getDonationHistory() {
  try {
    return JSON.parse(localStorage.getItem(DONATION_KEY) || "[]");
  } catch {
    return [];
  }
}
