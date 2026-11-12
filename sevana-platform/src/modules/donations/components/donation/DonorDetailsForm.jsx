import { useDonation } from "../../context/useDonation";
import Button from "../common/Button";
import "./DonorDetailsForm.css";

function DonorDetailsForm() {
  const { donation, updateDonation, nextStep, prevStep } = useDonation();

  const isValid =
    donation.donorName.trim() !== "" &&
    donation.donorEmail.trim() !== "" &&
    donation.donorPhone.trim() !== "";

  return (
    <div className="donation-step">
      <h2>Step 2 of 4 — Your Details</h2>

      <label className="donation-step__field">
        <span>Full Name *</span>
        <input
          type="text"
          value={donation.donorName}
          onChange={(e) => updateDonation({ donorName: e.target.value })}
          placeholder="Enter your full name"
        />
      </label>

      <label className="donation-step__field">
        <span>Email *</span>
        <input
          type="email"
          value={donation.donorEmail}
          onChange={(e) => updateDonation({ donorEmail: e.target.value })}
          placeholder="you@example.com"
        />
      </label>

      <label className="donation-step__field">
        <span>Phone Number *</span>
        <input
          type="tel"
          value={donation.donorPhone}
          onChange={(e) => updateDonation({ donorPhone: e.target.value })}
          placeholder="10-digit mobile number"
        />
      </label>

      <label className="donation-step__field">
        <span>PAN Number (optional, required for 80G receipt on amounts above ₹500)</span>
        <input
          type="text"
          value={donation.panNumber}
          onChange={(e) => updateDonation({ panNumber: e.target.value.toUpperCase() })}
          placeholder="ABCDE1234F"
          maxLength={10}
        />
      </label>

      <label className="donation-step__checkbox">
        <input
          type="checkbox"
          checked={donation.anonymous}
          onChange={(e) => updateDonation({ anonymous: e.target.checked })}
        />
        <span>Donate anonymously (your name won't be shown publicly)</span>
      </label>

      <div className="donation-step__actions">
        <Button variant="ghost" onClick={prevStep}>← Back</Button>
        <Button variant="accent" size="lg" disabled={!isValid} onClick={nextStep}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}

export default DonorDetailsForm;