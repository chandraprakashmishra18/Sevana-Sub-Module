import CampaignCard from "../campaigns/CampaignCard";
import NGOVerificationBadge from "./NGOVerificationBadge";
import "./NGOProfile.css";

function NGOProfile({ ngo, ngoCampaigns }) {
  return (
    <div className="ngo-profile">
      <div className="ngo-profile__header">
        <div className="ngo-profile__logo" aria-hidden="true">{ngo.name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h1>{ngo.name}</h1>
          <p className="ngo-profile__meta">
            {ngo.type} &nbsp;•&nbsp; 📍 {ngo.location || "Location not provided"}
          </p>
        </div>
      </div>

      <NGOVerificationBadge verificationStatus={ngo.verificationStatus} />

      <p className="ngo-profile__description">{ngo.description}</p>

      <div className="ngo-profile__stats">
        <div className="ngo-profile__stat">
          <strong>{ngoCampaigns.length}</strong>
          <span>Published campaigns</span>
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
