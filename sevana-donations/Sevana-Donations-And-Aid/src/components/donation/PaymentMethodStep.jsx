import { useState } from "react";
import { useDonation } from "../../context/useDonation";
import Button from "../common/Button";
import "./PaymentMethodStep.css";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
];

function PaymentMethodStep() {
  const { donation, updateDonation, nextStep, prevStep } = useDonation();
  const [processing, setProcessing] = useState(false);

  const handlePayClick = () => {
    setProcessing(true);
    // Simulated payment delay — in the real app, your teammate's backend
    // would call Razorpay here and wait for a real success callback.
    setTimeout(() => {
      const receiptId = `SEV-${Date.now().toString().slice(-8)}`;
      const receiptDate = new Date().toISOString();
      updateDonation({ receiptId, receiptDate });
      setProcessing(false);
      nextStep();
    }, 1800);
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
        {paymentMethods.map((method) => (
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