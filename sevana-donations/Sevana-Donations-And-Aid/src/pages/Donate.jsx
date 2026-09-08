import { useLocation } from "react-router-dom";
import { DonationProvider } from "../context/DonationContext";
import { useDonation } from "../context/useDonation";
import AmountSelector from "../components/donation/AmountSelector";
import DonorDetailsForm from "../components/donation/DonorDetailsForm";
import PaymentMethodStep from "../components/donation/PaymentMethodStep";
import ThankYouScreen from "../components/donation/ThankYouScreen";
import mockCampaigns from "../data/mockCampaigns";
import "./Donate.css";

function DonateStepRenderer() {
  const { step, donation } = useDonation();
  const campaign = mockCampaigns.find((c) => c.id === donation.campaignId);

  return (
    <div className="donate-page__card">
      <div className="donate-page__progress">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`donate-page__dot ${step >= s ? "donate-page__dot--active" : ""}`} />
        ))}
      </div>

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