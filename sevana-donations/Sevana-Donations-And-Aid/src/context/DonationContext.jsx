import { useState } from "react";
import { DonationContext } from "./donation-context-instance";
import { getCurrentUser } from "../services/authService";

export function DonationProvider({ children, initialCampaignId, initialAmount }) {
  const currentUser = getCurrentUser();
  const [step, setStep] = useState(1);
  const [donation, setDonation] = useState({
    campaignId: initialCampaignId || null,
    amount: initialAmount || 500,
    donorName: currentUser ? currentUser.name : "",
    donorEmail: currentUser ? currentUser.email : "",
    donorPhone: currentUser ? currentUser.phone : "",
    panNumber: "",
    anonymous: false,
    paymentMethod: "upi",
  });

  const updateDonation = (fields) => {
    setDonation((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <DonationContext.Provider
      value={{ step, setStep, nextStep, prevStep, donation, updateDonation }}
    >
      {children}
    </DonationContext.Provider>
  );
}
