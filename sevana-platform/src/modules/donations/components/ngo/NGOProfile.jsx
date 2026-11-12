import CampaignCard from "../campaigns/CampaignCard";
import NGOVerificationBadge from "./NGOVerificationBadge";
import "./NGOProfile.css";

function NGOProfile({ ngo, ngoCampaigns }) {
  return (
    <div className="ngo-profile">
      <div className="ngo-profile__cover">
        <img src={ngo.coverImage} alt={`${ngo.name} cover`} />
      </div>

      <div className="ngo-profile__header">
        <img src={ngo.logo} alt={ngo.name} className="ngo-profile__logo" />
        <div>
          <h1>{ngo.name}</h1>
          <p className="ngo-profile__meta">
            {ngo.focusArea} &nbsp;•&nbsp; 📍 {ngo.location}
          </p>
        </div>
      </div>

      <NGOVerificationBadge registrationNumber={ngo.registrationNumber} />

      <p className="ngo-profile__description">{ngo.description}</p>

      <div className="ngo-profile__stats">
        <div className="ngo-profile__stat">
          <strong>{ngo.campaignsRun}</strong>
          <span>Campaigns Run</span>
        </div>
        <div className="ngo-profile__stat">
          <strong>₹{(ngo.totalDisbursed / 100000).toFixed(1)}L</strong>
          <span>Total Disbursed</span>
        </div>
        <div className="ngo-profile__stat">
          <strong>{ngo.yearsActive}</strong>
          <span>Years Active</span>
        </div>
      </div>

      <div className="ngo-profile__campaigns">
        <h2>Active Campaigns by {ngo.name}</h2>
        {ngoCampaigns.length === 0 ? (
          <p className="ngo-profile__no-campaigns">
            No active campaigns from this NGO right now — check back soon.
          </p>
        ) : (
          <div className="ngo-profile__campaigns-grid">
            {ngoCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NGOProfile;