import { useEffect, useState } from "react";
import useCountUp from "../hooks/useCountUp";
import VerificationSteps from "../components/trust/VerificationSteps";
import { getAllCampaigns } from "../services/campaignService";
import { isCampaignPublic } from "../utils/campaignRules";
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
  const [campaigns, setCampaigns] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAllCampaigns().then((all) => {
      if (isMounted) setCampaigns(all.filter(isCampaignPublic));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!campaigns) {
    return (
      <section className="impact-page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  const totalRaised = campaigns.reduce((sum, c) => sum + (Number(c.raisedAmount) || 0), 0);
  const totalDonors = campaigns.reduce((sum, c) => sum + (Number(c.donorCount) || 0), 0);

  const allDisbursements = Object.entries(mockDisbursements)
    .flatMap(([campaignId, records]) => records.map((r) => ({ ...r, campaignId })))
    .filter((r) => campaigns.some((c) => c.id === r.campaignId));

  return (
    <section className="impact-page">
      <div className="container">
        <div className="impact-page__header">
          <h1>Impact and Transparency</h1>
          <p>
            Totals across the demo campaigns stored in this browser. Here's
            the platform-wide picture. All data is sample or locally saved.
          </p>
        </div>

        <div className="impact-page__stats-grid">
          <AnimatedStat value={totalRaised} prefix="₹" label="Total Raised" />
          <AnimatedStat value={totalDonors} label="Total Donors" />
          <AnimatedStat value={campaigns.length} label="Campaigns Run" />
          <AnimatedStat value={mockNGOs.length} label="Sample NGO Partners" />
        </div>

        <div className="impact-page__section">
          <h2>How a campaign goes live (demo)</h2>
          <VerificationSteps />
        </div>

        <div className="impact-page__section">
          <h2>Sample Disbursement Records</h2>
          <p className="impact-page__section-sub">
            Sample disbursement records for demonstration.
          </p>

          <div className="impact-page__disbursement-grid">
            {allDisbursements.map((item) => {
              const campaign = campaigns.find((c) => c.id === item.campaignId);
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