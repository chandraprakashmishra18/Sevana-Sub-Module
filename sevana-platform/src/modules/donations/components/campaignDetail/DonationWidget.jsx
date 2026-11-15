import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import { DONATION_PRESET_AMOUNTS } from "../../utils/constants";
import { getDonationBlockReason, MIN_DONATION, MAX_DONATION } from "../../utils/campaignRules";
import "./DonationWidget.css";

function DonationWidget({ campaign }) {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const navigate = useNavigate();

  const blockReason = getDonationBlockReason(campaign);
  const finalAmount = customAmount ? Number(customAmount) : selectedAmount || 0;

  let amountError = "";
  if (finalAmount < MIN_DONATION) {
    amountError = `Enter at least ₹${MIN_DONATION}.`;
  } else if (finalAmount > MAX_DONATION) {
    amountError = `Maximum ₹${MAX_DONATION.toLocaleString("en-IN")} per demo donation.`;
  }

  const handlePresetClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value.replace(/\D/g, "").slice(0, 7));
    setSelectedAmount(null);
  };

  const handleDonateClick = () => {
    if (amountError) return;
    navigate("/donate", { state: { campaignId: campaign.id, amount: finalAmount } });
  };

  const goalLine = (
    <p className="donation-widget__goal">
      Goal: ₹{Number(campaign.goalAmount).toLocaleString("en-IN")} &nbsp;•&nbsp; {campaign.donorCount} donors
    </p>
  );

  if (blockReason) {
    return (
      <div className="donation-widget">
        <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} />
        {goalLine}
        {blockReason === "goal-reached" ? (
          <div className="donation-widget__closed">Goal reached — thank you to everyone who donated.</div>
        ) : (
          <div className="donation-widget__closed donation-widget__closed--muted">
            This campaign is not accepting donations right now.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="donation-widget">
      <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} />
      {goalLine}

      <p className="donation-widget__label">Choose an amount</p>

      <div className="donation-widget__presets">
        {DONATION_PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-pressed={selectedAmount === amount}
            className={`amount-pill ${selectedAmount === amount ? "amount-pill--active" : ""}`}
            onClick={() => handlePresetClick(amount)}
          >
            ₹{amount.toLocaleString("en-IN")}
          </button>
        ))}
      </div>

      <input
        type="text"
        inputMode="numeric"
        maxLength={7}
        placeholder="Enter custom amount"
        aria-label="Custom donation amount in rupees"
        aria-invalid={Boolean(amountError)}
        className="donation-widget__custom"
        value={customAmount}
        onChange={handleCustomChange}
      />

      {amountError && <p className="donation-widget__error" role="alert">{amountError}</p>}

      <Button variant="accent" size="lg" fullWidth disabled={Boolean(amountError)} onClick={handleDonateClick}>
        Donate ₹{finalAmount.toLocaleString("en-IN")}
      </Button>

      <p className="donation-widget__note">
        Demo checkout: you'll see an on-screen receipt. No real payment is made.
      </p>
    </div>
  );
}

export default DonationWidget;