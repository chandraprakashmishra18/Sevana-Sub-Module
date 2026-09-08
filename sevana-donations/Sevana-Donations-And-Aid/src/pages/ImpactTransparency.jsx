import useCountUp from "../hooks/useCountUp";
import VerificationSteps from "../components/trust/VerificationSteps";
import mockCampaigns from "../data/mockCampaigns";
import mockDisbursements from "../data/mockDisbursements";
import mockNGOs from "../data/mockNGOs";
import "./ImpactTransparency.css";

function AnimatedStat({ value, label, prefix = "", suffix = "" }) {
  const count = useCountUp(value, 1600, true);
  const display = value >= 100000 ? (count / 100000).toFixed(1) + "L" : count.toLocaleString("en-IN");

  return (
    <div className="impact-page__stat">
      <p className="impact-page__stat-value">
        {prefix}{display}{suffix}
      </p>
      <p className="impact-page__stat-label">{label}</p>
    </div>
  );
}

function ImpactTransparency() {
  const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalDonors = mockCampaigns.reduce((sum, c) => sum + c.donorCount, 0);

  const allDisbursements = Object.entries(mockDisbursements).flatMap(([campaignId, records]) =>
    records.map((r) => ({ ...r, campaignId }))
  );

  return (
    <section className="impact-page">
      <div className="container">
        <div className="impact-page__header">
          <h1>Impact & Transparency</h1>
          <p>
            Every rupee on Sevana is tracked from donation to delivery. Here's
            the platform-wide picture — no cherry-picked numbers.
          </p>
        </div>

        <div className="impact-page__stats-grid">
          <AnimatedStat value={totalRaised} prefix="₹" label="Total Raised" />
          <AnimatedStat value={totalDonors} label="Total Donors" />
          <AnimatedStat value={mockCampaigns.length} label="Campaigns Run" />
          <AnimatedStat value={mockNGOs.length} label="Verified NGO Partners" />
        </div>

        <div className="impact-page__section">
          <h2>How every donation is verified</h2>
          <VerificationSteps />
        </div>

        <div className="impact-page__section">
          <h2>Recent Disbursement Proof</h2>
          <p className="impact-page__section-sub">
            Real, photo-verified records of funds actually being spent.
          </p>

          <div className="impact-page__disbursement-grid">
            {allDisbursements.map((item) => {
              const campaign = mockCampaigns.find((c) => c.id === item.campaignId);
              return (
                <div className="impact-proof-card" key={item.id}>
                  <img src={item.photo} alt={item.description} />
                  <div className="impact-proof-card__body">
                    <p className="impact-proof-card__campaign">
                      {campaign ? campaign.title : "Campaign"}
                    </p>
                    <p className="impact-proof-card__desc">{item.description}</p>
                    <div className="impact-proof-card__footer">
                      <span>{new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <strong>₹{item.amount.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImpactTransparency;