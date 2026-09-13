import { useState } from "react";
import { useDonation } from "../../context/useDonation";
import { submitDonation } from "../../services/donationService";
import Button from "../common/Button";
import "./PaymentMethodStep.css";
import { PAYMENT_METHODS } from "../../utils/constants";

function PaymentMethodStep() {
  const { donation, updateDonation, nextStep, prevStep } = useDonation();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayClick = async () => {
    setProcessing(true);
    setError("");

    try {
      // TEAMMATE: this currently resolves instantly with mock data.
      // Replace the inside of submitDonation() in donationService.js
      // with a real Razorpay checkout + backend call — this component
      // doesn't need to change when you do that.
      const result = await submitDonation(donation);

      if (result.success) {
        updateDonation({
          receiptId: result.receiptId,
          receiptDate: new Date().toISOString(),
        });
        nextStep();
      } else {
        setError("Payment could not be processed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="donation-step">
      <h2>Step 3 of 4 — Payment</h2>

      <div className="payment-summary">
        <span>Amount to pay</span>
        <strong>₹{donation.amount.toLocaleString("en-IN")}</strong>
      </div>

      <p className="donation-step__label">Choose payment method</p>

      <div className="payment-methods">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            className={`payment-method ${
              donation.paymentMethod === method.id ? "payment-method--active" : ""
            }`}
            onClick={() => updateDonation({ paymentMethod: method.id })}
            disabled={processing}
          >
            <span className="payment-method__icon">{method.icon}</span>
            {method.label}
          </button>
        ))}
      </div>

      {error && <p className="payment-error">{error}</p>}

      <p className="payment-note">
        🔒 This is a demo checkout for academic evaluation — no real payment
        gateway is connected yet. In production this step hands off to Razorpay.
      </p>

      <div className="donation-step__actions">
        <Button variant="ghost" onClick={prevStep} disabled={processing}>← Back</Button>
        <Button variant="accent" size="lg" onClick={handlePayClick} disabled={processing}>
          {processing ? "Processing..." : `Pay ₹${donation.amount}`}
        </Button>
      </div>
    </div>
  );
}

export default PaymentMethodStep;