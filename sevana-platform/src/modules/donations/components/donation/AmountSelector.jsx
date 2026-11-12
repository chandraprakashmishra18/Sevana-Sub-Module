import { useDonation } from "../../context/useDonation";
import Button from "../common/Button";
import { DONATION_PRESET_AMOUNTS } from "../../utils/constants";
import { getXPForDonation } from "../../data/mockDonorXP";
import "./AmountSelector.css";

function AmountSelector({ campaign }) {
  const { donation, updateDonation, nextStep } = useDonation();
  const estimatedXP = getXPForDonation(donation.amount || 0);

  return (
    <div className="donation-step">
      <h2>Step 1 of 4 — Confirm Your Amount</h2>

      {campaign && (
        <div className="donation-step__campaign-summary">
          <img src={campaign.image} alt={campaign.title} />
          <div>
            <p className="donation-step__campaign-title">{campaign.title}</p>
            <p className="donation-step__campaign-ngo">{campaign.ngo}</p>
          </div>
        </div>
      )}

      <p className="donation-step__label">Select amount</p>
      <div className="amount-selector__presets">
        {DONATION_PRESET_AMOUNTS.map((amt) => (
          <button
            key={amt}
            className={`amount-pill ${donation.amount === amt ? "amount-pill--active" : ""}`}
            onClick={() => updateDonation({ amount: amt })}
          >
            ₹{amt}
          </button>
        ))}
      </div>

      <input
        type="number"
        className="donation-step__input"
        placeholder="Or enter a custom amount"
        value={donation.amount || ""}
        onChange={(e) => updateDonation({ amount: Number(e.target.value) })}
        min="1"
      />

      {estimatedXP > 0 && (
        <div className="amount-selector__xp-tag">
          🌟 You will earn <strong>+{estimatedXP} Community XP</strong> with this donation!
        </div>
      )}

      <Button
        variant="accent"
        size="lg"
        fullWidth
        disabled={!donation.amount || donation.amount <= 0}
        onClick={nextStep}
      >
        Continue with ₹{donation.amount || 0}
      </Button>
    </div>
  );
}

export default AmountSelector;
