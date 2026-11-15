import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DonationProvider } from "../context/DonationContext";
import { useDonation } from "../context/useDonation";
import AmountSelector from "../components/donation/AmountSelector";
import DonorDetailsForm from "../components/donation/DonorDetailsForm";
import PaymentMethodStep from "../components/donation/PaymentMethodStep";
import ThankYouScreen from "../components/donation/ThankYouScreen";
import { findCampaignSync } from "../services/campaignService";
import { getDonationBlockReason } from "../utils/campaignRules";
import "./Donate.css";

const STEP_LABELS = ["Amount", "Details", "Payment", "Done"];

const BLOCKED_MESSAGES = {
  "not-found": { title: "Campaign not found", text: "We couldn't find that campaign." },
  unavailable: { title: "Campaign not available", text: "This campaign is not accepting donations right now." },
  "goal-reached": { title: "Goal reached ", text: "This campaign has reached its goal. Thank you to everyone who donated." },
};

function DonateStepRenderer() {
  const { step, donation } = useDonation();
  const campaign = findCampaignSync(donation.campaignId);
  const blockReason = donation.campaignId ? getDonationBlockReason(campaign) : "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (step < 4 && blockReason) {
    const message = BLOCKED_MESSAGES[blockReason];
    return (
      <div className="donate-page__card donate-page__blocked">
        <h2>{message.title}</h2>
        <p>{message.text}</p>
        <Link to="/campaigns" className="donate-page__blocked-link">Browse other campaigns</Link>
      </div>
    );
  }

  return (
    <div className="donate-page__card">
      <ol className="donate-stepper" aria-label="Donation steps">
        {STEP_LABELS.map((label, index) => {
          const number = index + 1;
          const state = step > number ? "done" : step === number ? "current" : "todo";
          return (
            <li
              key={label}
              className={`donate-stepper__item donate-stepper__item--${state}`}
              aria-current={step === number ? "step" : undefined}
            >
              <span className="donate-stepper__num">{step > number ? "✓" : number}</span>
              <span className="donate-stepper__label">{label}</span>
            </li>
          );
        })}
      </ol>

      {step > 1 && step < 4 && (
        <div className="donate-page__campaign">
          <strong>{campaign ? campaign.title : "General Fund"}</strong>
          {campaign && <span>{campaign.ngo}</span>}
        </div>
      )}

      {step === 1 && <AmountSelector campaign={campaign} />}
      {step === 2 && <DonorDetailsForm />}
      {step === 3 && <PaymentMethodStep />}
      {step === 4 && <ThankYouScreen />}
    </div>
  );
}

function Donate() {
  const location = useLocation();
  const { campaignId, amount } = location.state || {};

  return (
    <section className="donate-page">
      <div className="container donate-page__container">
        <DonationProvider initialCampaignId={campaignId} initialAmount={amount}>
          <DonateStepRenderer />
        </DonationProvider>
      </div>
    </section>
  );
}

export default Donate;