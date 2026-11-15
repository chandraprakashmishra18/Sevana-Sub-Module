import { useState } from "react";
import { useDonation } from "../../context/useDonation";
import Button from "../common/Button";
import "./DonorDetailsForm.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;

function cleanPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

function getErrors(donation) {
  const errors = {};
  if (String(donation.donorName || "").trim().length < 2) {
    errors.donorName = "Enter your full name.";
  }
  if (!EMAIL_PATTERN.test(String(donation.donorEmail || "").trim())) {
    errors.donorEmail = "Enter a valid email address.";
  }
  if (!PHONE_PATTERN.test(cleanPhone(donation.donorPhone))) {
    errors.donorPhone = "Enter a valid 10-digit mobile number.";
  }
  const pan = String(donation.panNumber || "").trim();
  if (pan && !PAN_PATTERN.test(pan)) {
    errors.panNumber = "PAN looks like ABCDE1234F (5 letters, 4 digits, 1 letter).";
  }
  return errors;
}

function DonorDetailsForm() {
  const { donation, updateDonation, nextStep, prevStep } = useDonation();
  const [touched, setTouched] = useState({});

  const errors = getErrors(donation);
  const isValid = Object.keys(errors).length === 0;

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
  const showError = (field) => (touched[field] ? errors[field] : "");

  const handleContinue = () => {
    if (!isValid) {
      setTouched({ donorName: true, donorEmail: true, donorPhone: true, panNumber: true });
      return;
    }
    updateDonation({
      donorName: donation.donorName.trim(),
      donorEmail: donation.donorEmail.trim(),
      donorPhone: cleanPhone(donation.donorPhone),
      panNumber: (donation.panNumber || "").trim(),
    });
    nextStep();
  };

  return (
    <div className="donation-step">
      <h2>Step 2 of 4 — Your Details</h2>

      <label className="donation-step__field">
        <span>Full Name *</span>
        <input
          type="text"
          value={donation.donorName}
          onChange={(e) => updateDonation({ donorName: e.target.value })}
          onBlur={() => touch("donorName")}
          aria-invalid={Boolean(showError("donorName"))}
          placeholder="Enter your full name"
        />
        {showError("donorName") && <small className="donation-step__error" role="alert">{showError("donorName")}</small>}
      </label>

      <label className="donation-step__field">
        <span>Email *</span>
        <input
          type="email"
          value={donation.donorEmail}
          onChange={(e) => updateDonation({ donorEmail: e.target.value })}
          onBlur={() => touch("donorEmail")}
          aria-invalid={Boolean(showError("donorEmail"))}
          placeholder="you@example.com"
        />
        {showError("donorEmail") && <small className="donation-step__error" role="alert">{showError("donorEmail")}</small>}
      </label>

      <label className="donation-step__field">
        <span>Phone Number *</span>
        <input
          type="tel"
          value={donation.donorPhone || ""}
          onChange={(e) => updateDonation({ donorPhone: e.target.value })}
          onBlur={() => touch("donorPhone")}
          aria-invalid={Boolean(showError("donorPhone"))}
          placeholder="10-digit mobile number"
        />
        {showError("donorPhone") && <small className="donation-step__error" role="alert">{showError("donorPhone")}</small>}
      </label>

      <label className="donation-step__field">
        <span>PAN Number (optional)</span>
        <input
          type="text"
          value={donation.panNumber}
          onChange={(e) => updateDonation({ panNumber: e.target.value.toUpperCase() })}
          onBlur={() => touch("panNumber")}
          aria-invalid={Boolean(showError("panNumber"))}
          placeholder="ABCDE1234F"
          maxLength={10}
        />
        {showError("panNumber") && <small className="donation-step__error" role="alert">{showError("panNumber")}</small>}
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
        <Button variant="accent" size="lg" onClick={handleContinue}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}

export default DonorDetailsForm;