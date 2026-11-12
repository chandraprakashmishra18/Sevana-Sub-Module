import mockDonors from "../data/mockDonors";
import mockDisbursements from "../data/mockDisbursements";
import { getXPForDonation } from "../data/mockDonorXP";
import { getCurrentUser, getUsers, awardUserXP, recordUserDonation } from "./authService";

const DONATION_KEY = "sevana_donation_history";

export async function getDonorsByCampaign(campaignId) {
  const history = getDonationHistory().filter((d) => d.campaignId === campaignId);
  const formattedFromHistory = history.map((d) => ({
    name: d.anonymous ? "Anonymous Supporter" : d.donorName,
    amount: Number(d.amount),
    date: "Just now",
    xpEarned: d.xp || 0,
  }));
  const baseDonors = mockDonors[campaignId] || [];
  return Promise.resolve([...formattedFromHistory, ...baseDonors]);
}

export async function getDisbursementsByCampaign(campaignId) {
  return Promise.resolve(mockDisbursements[campaignId] || []);
}

export async function submitDonation(donationData) {
  const receiptId = `SEV-${Date.now().toString().slice(-8)}`;
  const xp = getXPForDonation(Number(donationData.amount) || 0);
  const donation = {
    ...donationData,
    receiptId,
    xp,
    createdAt: new Date().toISOString(),
  };

  try {
    const history = JSON.parse(localStorage.getItem(DONATION_KEY) || "[]");
    history.unshift(donation);
    localStorage.setItem(DONATION_KEY, JSON.stringify(history));

    const currentUser = getCurrentUser();
    const realUsers = getUsers();
    const email = (donationData.donorEmail || "").toLowerCase().trim();
    const targetUser =
      (currentUser && currentUser.email.toLowerCase() === email)
        ? currentUser
        : realUsers.find((u) => u.email.toLowerCase() === email);

    if (targetUser) {
      awardUserXP(targetUser.id, xp, `Donated ₹${donationData.amount}`);
      recordUserDonation(targetUser.id, {
        campaignId: donationData.campaignId,
        amount: Number(donationData.amount),
        xpEarned: xp,
        date: new Date().toISOString().split("T")[0],
      });
    }

    return { success: true, receiptId, xp };
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
