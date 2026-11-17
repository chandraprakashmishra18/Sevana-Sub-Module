import { useState } from "react";
import { useDonation } from "../../context/useDonation";
import { submitDonation } from "../../services/donationService";
import Button from "../common/Button";
import "./PaymentMethodStep.css";

function PaymentMethodStep() {
  const { donation, updateDonation, nextStep, prevStep } = useDonation();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayClick = async () => {
    setProcessing(true);
    setError("");

    try {
      const result = await submitDonation(donation);

      if (result.success) {
        updateDonation({
          donationId: result.donation.id,
          donationStatus: result.status,
        });
        nextStep();
      } else {
        setError("Payment could not be processed. Please try again.");
      }
    } catch (requestError) {
      setError(requestError.message || "Could not record the donation request. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="donation-step">
      <h2>Step 3 of 4 — Record donation</h2>

      <div className="payment-summary">
        <span>Amount to pay</span>
        <strong>₹{donation.amount.toLocaleString("en-IN")}</strong>
      </div>

      {error && <p className="payment-error">{error}</p>}

      <p className="payment-note">
        No payment provider is connected. Continuing records a pending donation request; no money will be transferred.
      </p>

      <div className="donation-step__actions">
        <Button variant="ghost" onClick={prevStep} disabled={processing}>← Back</Button>
        <Button variant="accent" size="lg" onClick={handlePayClick} disabled={processing}>
          {processing ? "Recording…" : "Record pending donation"}
        </Button>
      </div>
    </div>
  );
}

export default PaymentMethodStep;
