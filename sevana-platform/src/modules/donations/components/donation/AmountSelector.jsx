import { useDonation } from "../../context/useDonation";
import Button from "../common/Button";
import { DONATION_PRESET_AMOUNTS } from "../../utils/constants";
import { getXPForDonation } from "../../data/mockDonorXP";
import "./AmountSelector.css";

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 100000;

function AmountSelector({ campaign }) {
  const { donation, updateDonation, nextStep } = useDonation();
  const amount = Number(donation.amount) || 0;
  const estimatedXP = getXPForDonation(amount);

  let amountError = "";
  if (amount < MIN_AMOUNT) {
    amountError = `Enter an amount of at least ₹${MIN_AMOUNT}.`;
  } else if (amount > MAX_AMOUNT) {
    amountError = `Maximum ₹${MAX_AMOUNT.toLocaleString("en-IN")} per demo donation.`;
  }

  const handleCustomChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    updateDonation({ amount: digitsOnly ? Number(digitsOnly) : 0 });
  };

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
            type="button"
            aria-pressed={amount === amt}
            className={`amount-pill ${amount === amt ? "amount-pill--active" : ""}`}
            onClick={() => updateDonation({ amount: amt })}
          >
            ₹{amt.toLocaleString("en-IN")}
          </button>
        ))}
      </div>

      <input
        type="text"
        inputMode="numeric"
        maxLength={7}
        className="donation-step__input"
        placeholder="Or enter a custom amount"
        aria-label="Custom donation amount in rupees"
        aria-invalid={Boolean(amountError)}
        value={donation.amount || ""}
        onChange={handleCustomChange}
      />

      {amountError && <p className="donation-step__error" role="alert">{amountError}</p>}

      {estimatedXP > 0 && !amountError && (
        <div className="amount-selector__xp-tag">
          You will earn <strong>+{estimatedXP} Community XP</strong> with this donation!
        </div>
      )}

      <Button
        variant="accent"
        size="lg"
        fullWidth
        disabled={Boolean(amountError)}
        onClick={nextStep}
      >
        Continue with ₹{amount.toLocaleString("en-IN")}
      </Button>
    </div>
  );
}

export default AmountSelector;