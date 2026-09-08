import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";
import "./DonationWidget.css";

const presetAmounts = [100, 500, 1000, 2500];

function DonationWidget({ campaign }) {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const navigate = useNavigate();

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handlePresetClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleDonateClick = () => {
    navigate("/donate", {
      state: { campaignId: campaign.id, amount: finalAmount },
    });
  };

  return (
    <div className="donation-widget">
      <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} />

      <p className="donation-widget__goal">
        Goal: ₹{campaign.goalAmount.toLocaleString("en-IN")} &nbsp;•&nbsp;{" "}
        {campaign.donorCount} donors
      </p>

      <p className="donation-widget__label">Choose an amount</p>

      <div className="donation-widget__presets">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            className={`amount-pill ${selectedAmount === amount ? "amount-pill--active" : ""}`}
            onClick={() => handlePresetClick(amount)}
          >
            ₹{amount}
          </button>
        ))}
      </div>

      <input
        type="number"
        placeholder="Enter custom amount"
        className="donation-widget__custom"
        value={customAmount}
        onChange={handleCustomChange}
        min="1"
      />

      <Button variant="accent" size="lg" fullWidth onClick={handleDonateClick}>
        Donate ₹{finalAmount || 0}
      </Button>

      <p className="donation-widget__note">
        You'll receive an 80G tax-exemption receipt instantly after payment.
      </p>
    </div>
  );
}

export default DonationWidget;