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
          donationIntentId: result.donationIntentId,
          donationStatus: result.status,
          paymentStatus: result.paymentStatus,
        });
        nextStep();
      } else {
        setError(result.error || "Unable to record donation intent.");
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to record donation intent.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="donation-step">
      <h2>Step 3 of 4 — Donation intent</h2>

      <div className="payment-summary">
        <span>Intent amount</span>
        <strong>₹{donation.amount.toLocaleString("en-IN")}</strong>
      </div>

      <p className="payment-note">No payment provider is configured. This action stores a pending donation intent only; no money is transferred and no tax receipt is issued.</p>

      {error && <p className="payment-error">{error}</p>}

      <p className="payment-note">
        Payment remains pending until an approved payment provider confirms it.
      </p>

      <div className="donation-step__actions">
        <Button variant="ghost" onClick={prevStep} disabled={processing}>← Back</Button>
        <Button variant="accent" size="lg" onClick={handlePayClick} disabled={processing}>
          {processing ? "Saving..." : "Record donation intent"}
        </Button>
      </div>
    </div>
  );
}

export default PaymentMethodStep;
