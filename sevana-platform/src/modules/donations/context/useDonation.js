import { useContext } from "react";
import { DonationContext } from "./donation-context-instance";

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonation must be used within a DonationProvider");
  }
  return context;
}